import { Request, Response } from 'express';
import { LoginUserDto } from '../../auth/login-user.dto';
import { RegisterUserDto } from '../../auth/register-user.dto';
import { GetUserDto } from '../../auth/get-user.dto';
import { AuthService } from '../services/auth.service';

export class AuthController {

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

  // Método para obtener todos los usuarios
  getAllUsers = async (req: Request, res: Response) => {
    try {
      const users = await this.authService.getAllUsers(); // Llamada al servicio para obtener todos los usuarios
      return res.status(200).json(users); // Respuesta exitosa con los usuarios
    } catch (error: unknown) {
      console.error('Error fetching users:', error);
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Unknown error occurred' });
      }
    }
  };



}