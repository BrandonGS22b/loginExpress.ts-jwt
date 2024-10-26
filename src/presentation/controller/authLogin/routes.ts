import { envs } from '../../../config';
import { Router } from 'express';
import AuthController from './controller';
import { AuthService, EmailService } from '../../services';

class AuthRoutes {
  static get routes(): Router {
    const router = Router();

    const emailService = new EmailService(
      envs.MAILER_SERVICE,
      envs.MAILER_EMAIL,
      envs.MAILER_SECRET_KEY,
    );

    const authService = new AuthService(emailService);
    const controller = new AuthController(authService);

    // Definir las rutas para el login que es controller.ts
    router.post('/login', controller.loginUser);
    router.post('/register', controller.registerUser);
    router.get('/get', controller.getAllUsers); 
    router.put('/users/:userId', controller.updateUser);
    router.delete('/users/:userId', controller.deleteUser);
    router.get('/users/:userId', controller.getUserById);
    router.post('/users/:id/upload-image', controller.uploadUserImage); 
    router.get('/validate-email/:token', controller.validateEmail);


    router.get('/technicians', controller.getTechnicians); // Para obtener todos los técnicos
    router.get('/technicians/:userId', controller.getTechnicianById); // Obtener técnico por ID
    router.post('/assign-technician', controller.assignTechnician); // Para asignar un técnico a una tarea


    router.get('/verify', controller.verifyToken);
    router.post('/logout', controller.logout);
    return router;
  }
}
export default AuthRoutes;
