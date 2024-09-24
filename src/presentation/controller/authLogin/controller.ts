import { Request, Response } from 'express';
import { LoginUserDto } from '../../../auth/login-user.dto';
import { RegisterUserDto } from '../../../auth/register-user.dto';
import { GetUserDto } from '../../../auth/get-user.dto';
import { AuthService } from '../../services/auth.service';
import { JwtAdapter } from '../../../config';
import { upload } from '../../../middleware/fileUpload.middleware';

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




  registerUser = (req: Request, res: Response) => {
    const [error, registerDto] = RegisterUserDto.create(req.body);
    if ( error ) return res.status(400).json({error})


    this.authService.registerUser(registerDto!)
      .then( (user) => res.json(user) )
      .catch( error => this.handleError(error, res) );
      
  }



  loginUser = (req: Request, res: Response) => {

    const [error, loginUserDto] = LoginUserDto.create(req.body);
    if ( error ) return res.status(400).json({error})


    this.authService.loginUser(loginUserDto!)
      .then( (user) => res.json(user) )
      .catch( error => this.handleError(error, res) );
      
  }



  validateEmail = (req: Request, res: Response) => {
    const { token } = req.params;
    
    this.authService.validateEmail( token )
      .then( () => res.json('Email was validated properly') )
      .catch( error => this.handleError(error, res) );

  }

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



}
export default AuthController;