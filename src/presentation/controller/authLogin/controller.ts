import { Request, Response } from 'express';
import { LoginUserDto } from '../../../auth/login-user.dto';
import { RegisterUserDto } from '../../../auth/register-user.dto';
import { GetUserDto } from '../../../auth/get-user.dto';
import { AuthService } from '../../services/auth.service';
import { JwtAdapter } from '../../../config';
import { upload } from '../../../middleware/fileUpload.middleware';
import { UserModel } from '../../../mongo/models/user.model';
import GestionTecnicosModel  from '../../../mongo/models/GestionTecnicos.model';
class AuthController {

  // DI
  constructor(
    public readonly authService: AuthService,
  ) {}

  private handleError = (error: unknown, res: Response) => {
    // Manejo genérico de errores
    console.error(error); // Log del error en el servidor
    return res.status(500).json({ error: 'Internal server error' });
  };




  //controller para el inicio de session
  loginUser = async (req: Request, res: Response): Promise<Response> => {
    try {
      // Validar los datos recibidos
      const [error, loginUserDto] = LoginUserDto.create(req.body);
      if (error) {
        return res.status(400).json({ error: 'Invalid input data', details: error });
      }
  
      // Autenticar al usuario y generar token
      const { user } = await this.authService.loginUser(loginUserDto!);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      // Generar el token JWT
      const expiresIn = 3600; // 1 hora en segundos
      const token = JwtAdapter.generateToken({ id: user._id, role: user.role }, '1h');
      
      // Configurar la cookie HTTP-only con el token
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: expiresIn * 1000, // 1 hora
        sameSite: 'strict',
      });
  
      // Devolver respuesta exitosa
      return res.status(200).json({
        message: 'Login successful',
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          emailValidated: user.emailValidated,
        },
        token,
        expiresIn,
      });
    } catch (error) {
      return res.status(500).json({ error: 'An error occurred during login' });
    }
  };



  //controller para el registro de usuario
  registerUser = (req: Request, res: Response) => {
    const [error, registerDto] = RegisterUserDto.create(req.body);
    
    if (error || !registerDto) { 
      return res.status(400).json({ error: 'Invalid input data' });
    }
  
    // Luego puedes proceder con la lógica
    this.authService.registerUser(registerDto)
      .then((user) => res.json(user))
      .catch((error) => this.handleError(error, res));
  }

  //controller para la actualizacion de usarios
  updateUser = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const updateData = req.body; // Datos de la actualización
  
    try {
      const updatedUser = await this.authService.updateUserById(userId, updateData);
      return res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
      return this.handleError(error, res);
    }
  };
  

  //controller para eliminar usuario
  deleteUser = async (req: Request, res: Response) => {
    const { userId } = req.params;
  
    try {
      const result = await this.authService.deleteUserById(userId);
      return res.status(200).json(result);
    } catch (error) {
      return this.handleError(error, res);
    }
  };

  //controller para obtener usuario por id

  getUserById = async (req: Request, res: Response) => {
    const { userId } = req.params;
  
    try {
      const user = await this.authService.getUserById(userId);
      return res.status(200).json(user);
    } catch (error) {
      return this.handleError(error, res);
    }
  };
  
  


//validar email si acepta la solicitud 
  validateEmail = (req: Request, res: Response) => {
    const { token } = req.params;
    
    this.authService.validateEmail( token )
      .then( () => res.json('Email was validated properly') )
      .catch( error => this.handleError(error, res) );

  }
  //metodo para verificar el token 

  verifyToken = async (req: Request, res: Response) => {
    try {
      const token = req.cookies.token; // Obtener el token de la cookie
  
      if (!token) {
        return res.status(401).json({ error: 'Token is missing' });
      }
  
      const payload = await JwtAdapter.validateToken<{ id: string; role: string }>(token); // Validar el token
  
      if (!payload) {
        return res.status(401).json({ error: 'Invalid token' });
      }
  
      // Si el token es válido, enviar más datos del usuario si es necesario
      return res.status(200).json({
        message: 'Token is valid',
        userId: payload.id,
        role: payload.role // Puedes devolver más datos si los tienes
      });
  
    } catch (error) {
      // Capturar cualquier error que ocurra durante la validación del token
      console.error('Token verification failed:', error);
      return res.status(500).json({ error: 'Internal server error during token verification' });
    }
  };
  



  

// Método para obtener todos los usuarios con validación de token
getAllUsers = async (req: Request, res: Response) => {
  // Extraer el token del encabezado Authorization
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token is missing' });
  }

  try {
    // Valida el token en el controlador
    const payload = JwtAdapter.validateToken(token);
    if (!payload) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Llamar al servicio para obtener todos los usuarios
    const users = await this.authService.getAllUsers();

    // Formatear los usuarios si es necesario
    const formattedUsers = users.map(user => {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        emailValidated: user.emailValidated,
        role: user.role,
        img: user.img || null // Puedes añadir otros campos o transformarlos
      };
    });

    // Incluir el token en la respuesta
    return res.status(200).json({
      token,        // Devolver el token que se usó en la solicitud
      users: formattedUsers // Los usuarios formateados
    });
  } catch (error: unknown) {
    console.error('Error fetching users:', error);
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    } else {
      return res.status(500).json({ error: 'Unknown error occurred' });
    }
  }
};


//cargar imagenes


uploadUserImage = (req: Request, res: Response) => {
  // `upload.single('image')` maneja la subida de una sola imagen en postman 
  upload.single('image')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    console.log('hola mensaje');
    console.log('req.file:', req.file);
    console.log('req.body:', req.body);
    // Obtener el ID del usuario y la ruta de la imagen subida
    const userId = req.params.id;
    const imageUrl = req.file?.path;

    if (!imageUrl) {
      return res.status(400).json({ error: 'No image provided' });
    }

    try {
      // Guardar la URL de la imagen en el modelo del usuario
      const updatedUser = await this.authService.updateUserImage(userId, imageUrl);
      return res.status(200).json(updatedUser);
    } catch (error) {
      return res.status(500).json({ error: 'Error updating user image' });
    }
  });
};



///metodo para cerrar session 
logout = (req: Request, res: Response) => {
  res.clearCookie('token'); // Borra la cookie del token
  return res.status(200).json({ message: 'Logout successful' });
};


getTechnicians = async (req: Request, res: Response) => {
  try {
    const technicians = await this.authService.getTechnicians(); // Llama al servicio para obtener técnicos
    return res.status(200).json(technicians);
  } catch (error) {
    return this.handleError(error, res);
  }
};



getTechnicianById = async (req: Request, res: Response) => {
  const { userId } = req.params; // Obtenemos el ID del técnico desde los parámetros de la URL

  try {
    // Llamamos al servicio para obtener el técnico por ID
    const technician = await this.authService.getTechnicianById(userId);
    
    if (!technician) {
      return res.status(404).json({ error: 'Technician not found' });
    }

    // Devolvemos la información del técnico excluyendo la contraseña
    return res.status(200).json(technician);
  } catch (error) {
    return this.handleError(error, res);
  }
};


// Método para asignar un técnico a una solicitud
assignTechnician = async (req: Request, res: Response) => {
  const { solicitudId, tecnicoId, descripcion, estado } = req.body; // Agrega los campos necesarios
  
  try {
    // Verifica si la asignación ya existe
    const existingAssignment = await GestionTecnicosModel.findOne({ solicitudId });
    if (existingAssignment) {
      return res.status(400).json({ message: 'Esta solicitud ya tiene un técnico asignado' });
    }

    // Crea la asignación del técnico a la solicitud
    const newAssignment = await GestionTecnicosModel.create({
      solicitudId,
      tecnicoId,
      descripcion,
      estado,
    });

    return res.status(201).json({
      message: 'Technician assigned successfully',
      result: newAssignment,
    });
  } catch (error) {
    console.error('Error assigning technician:', error);
    return res.status(500).json({
      message: 'Error al asignar técnico o actualizar el estado de la solicitud. Inténtalo de nuevo más tarde.',
    });
  }
};


// Desactivar usuario
disableUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { estado: "inactivo" }, // Cambia el estado del usuario
      { new: true } // Devuelve el documento actualizado
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User deactivated successfully", user: updatedUser });
  } catch (error) {
    return this.handleError(error, res);
  }
};

// Activar usuario
enableUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { estado: "activo" }, // Cambia el estado del usuario
      { new: true } // Devuelve el documento actualizado
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User activated successfully", user: updatedUser });
  } catch (error) {
    return this.handleError(error, res);
  }
};


}
export default AuthController;