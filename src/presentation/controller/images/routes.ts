import { Router } from 'express';
import { ImageController } from './controller';

export class ImageRoutes {

  static get routes(): Router {
    const router = Router();
    const controller = new ImageController();

    // Ruta para obtener una imagen
    router.get('/:type/:img', controller.getImage);

    // Ruta para cargar una imagen
    router.post('/upload', ImageController.upload, controller.uploadImage);

    return router;
  }
}
