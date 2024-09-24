import { envs } from '../../../config';
import { Router } from 'express';
import AuthController from './controller';

import { AuthService, EmailService } from '../../services';




class Authroutes {


  static get routes(): Router {

    const router = Router();

    const emailService = new EmailService(
      envs.MAILER_SERVICE,
      envs.MAILER_EMAIL,
      envs.MAILER_SECRET_KEY,
    );

    const authService = new AuthService(emailService);

    const controller = new AuthController(authService);

    const getUsers = new AuthController(authService);

    const uploadImages = new AuthController(authService);
    
    // Definir las rutas para el login que es controller.ts
    router.post('/login', controller.loginUser );
    router.post('/register', controller.registerUser );
    router.get('/get', getUsers.getAllUsers ); // Añadir esta ruta al final para que funcione con la validación JWT.
    router.post('/users/:id/upload-image', uploadImages.uploadUserImage);


    
    router.get('/validate-email/:token', controller.validateEmail );



    return router;
  }


}
export default Authroutes;
