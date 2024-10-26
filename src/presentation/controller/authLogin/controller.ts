import { Request, Response } from 'express';
import { LoginUserDto } from '../../../auth/login-user.dto';
import { RegisterUserDto } from '../../../auth/register-user.dto';
import { GetUserDto } from '../../../auth/get-user.dto';
import { AuthService } from '../../services/auth.service';
import { JwtAdapter } from '../../../config';
import { upload } from '../../../middleware/fileUpload.middleware';
import { UserModel } from '../../../mongo/models/user.model';

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
  loginUser = async (req: Request, res: Response) => {
    try {
      // Validar los datos recibidos
      const [error, loginUserDto] = LoginUserDto.create(req.body);
      if (error) {
        return res.status(400).json({ error });
      }
  
      // Autenticar al usuario
      const { user, token: generatedToken } = await this.authService.loginUser(loginUserDto!);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      const expiresIn = 60; // 1 hora en segundos
  
      // Generar el token JWT usando user._id y el rol
      const token = await JwtAdapter.generateToken({ id: user._id, role: user.role }, '1h'); // Usa 1h para 1 hora
      if (!token) {
        return res.status(500).json({ error: 'Failed to generate token' });
      }
  
      // Configurar la cookie HTTP-only con el token (opcional si solo quieres usar el token desde el cliente)
      res.cookie('token', token, {
        httpOnly: true, // Protege la cookie para que solo sea accesible desde el servidor
        secure: process.env.NODE_ENV === 'production', // Solo en HTTPS en producción
        maxAge: expiresIn * 1000, // 1 hora
        sameSite: 'strict' // Prevenir CSRF
      });
  
      // Devolver respuesta exitosa con el token, usuario y tiempo de expiración
      return res.status(200).json({ 
        message: 'Login successful', 
        user: { 
          _id: user._id, 
          name: user.name, 
          email: user.email, 
          emailValidated: user.emailValidated, 
          role: user.role // Asegúrate de que el rol esté aquí
        },
        token, // Aquí incluimos el token en la respuesta JSON
        expiresIn, // Incluimos el tiempo de expiración en la respuesta
      });
    } catch (error) {
      // Manejar errores de manera uniforme
      return this.handleError(error, res);
    }
  };



  //controller para el registro de usuario
  registerUser = (req: Request, res: Response) => {
    const [error, registerDto] = RegisterUserDto.create(req.body);
    if ( error ) return res.status(400).json({error})


    this.authService.registerUser(registerDto!)
      .then( (user) => res.json(user) )
      .catch( error => this.handleError(error, res) );
      
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
  const { requestId, technicianId } = req.body; // Asumiendo que se envían ambos IDs en el cuerpo de la solicitud
  
  try {
    const result = await this.authService.assignTechnician(requestId, technicianId); // Llama al servicio para asignar el técnico
    return res.status(200).json({ message: 'Technician assigned successfully', result });
  } catch (error) {
    return this.handleError(error, res);
  }
};
}
export default AuthController;