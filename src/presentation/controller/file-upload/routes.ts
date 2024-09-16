import { Router, Request, Response, NextFunction } from 'express';
import { FileUploadController } from './controller';
import { FileUploadService } from '../../services/file-upload.service';
import multer from 'multer';

// Configurar multer para manejar la carga de archivos
const upload = multer({ limits: { fileSize: 1024 * 1024 * 5 } }); // Limita el tamaño del archivo a 5 MB

// Middleware para validar tipos
const validTypesMiddleware = (validTypes: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { type } = req.params;
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: `Invalid type: ${type}, valid ones: ${validTypes}` });
    }
    next();
  };
};

export class FileUploadRoutes {

  static get routes(): Router {

    const router = Router();
    const controller = new FileUploadController(new FileUploadService());

    // Usar multer para manejar las cargas de archivos
    router.post('/single/:type',
      validTypesMiddleware(['users', 'products', 'categories']),
      upload.single('file'),  // Un solo archivo
      controller.uploadFile
    );

    router.post('/multiple/:type',
      validTypesMiddleware(['users', 'products', 'categories']),
      upload.array('files', 10),  // Hasta 10 archivos
      controller.uploadMultipleFiles
    );

    return router;
  }
}
