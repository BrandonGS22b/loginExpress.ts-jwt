import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';
import multer from 'multer';
import { ImageModel } from '../../models/image.model'; // Importa tu modelo de imagen buscalo 

// Configuración de multer para almacenar imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/images/'); // Carpeta donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Nombre único basado en la fecha
  }
});

const upload = multer({ storage });

export class ImageController {

  constructor() {}

  // Obtener imagen por tipo y nombre
  getImage = (req: Request, res: Response) => {
    const { type = '', img = '' } = req.params;
    const imagePath = path.resolve(__dirname, `../../../uploads/${type}/${img}`);
    console.log(imagePath);

    if (!fs.existsSync(imagePath)) {
      return res.status(404).send('Image not found');
    }

    res.sendFile(imagePath);
  }

  // Subir una imagen
  uploadImage = async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No image was uploaded' });
    }

    const imagePath = req.file.path;

    // Crear una entrada en la base de datos para la imagen
    try {
      const newImage = await ImageModel.create({
        filename: req.file.filename,
        path: imagePath,
        mimetype: req.file.mimetype,
        size: req.file.size,
      });

      return res.status(201).json({ message: 'Image uploaded successfully', image: newImage });
    } catch (error) {
      console.error('Error saving image to database:', error);
      return res.status(500).json({ error: 'Failed to save image data' });
    }
  }

  // Exponer el middleware de multer
  static upload = upload.single('image');
}
