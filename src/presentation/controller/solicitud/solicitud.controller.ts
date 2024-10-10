import { Request, Response } from 'express';
import Solicitud, { ISolicitud } from '../../../mongo/models/solicitud.model';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configuración de multer para manejar la subida de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.resolve(__dirname, '../../../../uploads/');
    // Crear la carpeta si no existe
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath); // Carpeta donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Nombre único basado en la fecha
  }
});

// Filtro para validar el tipo de archivo
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const filetypes = /jpeg|jpg|png/; // Extensiones permitidas
  const mimetype = filetypes.test(file.mimetype); // Verifica el tipo MIME
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase()); // Verifica la extensión

  if (mimetype && extname) {
    return cb(null, true); // Acepta el archivo
  } else {
    cb(new Error('Solo se permiten archivos de imagen .png, .jpg, .jpeg')); // Rechaza el archivo
  }
};

const upload = multer({ storage, fileFilter }); // Agrega el fileFilter aquí

// Crear una nueva solicitud con imagen
export const crearSolicitud = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Body:', req.body);
    console.log('File:', req.file);

    const { usuario_id, categoria, descripcion, telefono, departamento, ciudad, barrio, direccion, estado } = req.body;

    // Validar campos requeridos
    if (!usuario_id || !categoria || !descripcion || !departamento || !ciudad || !barrio || !direccion || !estado || !telefono) {
      res.status(400).json({ message: 'Todos los campos requeridos deben ser proporcionados' });
      return;
    }

    let imagenNombre: string | undefined;

    // Verificar si se subió una imagen
    if (req.file) {
      imagenNombre = req.file.filename; // Guardamos solo el nombre del archivo
    }

    const solicitud = new Solicitud({
      usuario_id,
      categoria, // Usamos el campo 'categoria' en lugar de 'categoria_id'
      descripcion,
      imagen: imagenNombre, // Guardamos solo el nombre del archivo
      telefono,
      departamento,
      ciudad,
      barrio,
      direccion,
      estado,
      fecha_creacion: new Date(), // Asignamos la fecha de creación
    });

    const solicitudGuardada = await solicitud.save();
    res.status(201).json(solicitudGuardada);
  } catch (error) {
    console.error('Error al crear la solicitud:', error);
    res.status(500).json({ message: 'Error al crear la solicitud' });
  }
};

// Obtener todas las solicitudes (incluyendo imágenes)
export const obtenerSolicitudes = async (req: Request, res: Response): Promise<void> => {
  try {
    const solicitudes = await Solicitud.find();
    res.status(200).json(solicitudes);
  } catch (error) {
    console.error('Error al obtener las solicitudes:', error);
    res.status(500).json({ message: 'Error al obtener las solicitudes' });
  }
};

// Obtener una solicitud por ID
export const obtenerSolicitudPorId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const solicitud = await Solicitud.findById(id);
    if (!solicitud) {
      res.status(404).json({ message: 'Solicitud no encontrada' });
      return;
    }
    res.status(200).json(solicitud);
  } catch (error) {
    console.error('Error al obtener la solicitud:', error);
    res.status(500).json({ message: 'Error al obtener la solicitud' });
  }
};

// Actualizar una solicitud (opcionalmente con una nueva imagen)
export const actualizarSolicitud = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    // Verificar si se subió una nueva imagen
    if (req.file) {
      updatedData.imagen = req.file.filename; // Guardar solo el nombre del archivo

      // Eliminar la imagen anterior si existía
      const solicitud = await Solicitud.findById(id);
      if (solicitud?.imagen) {
        const imagenPath = path.resolve(__dirname, '../../../../uploads/', solicitud.imagen);
        fs.unlink(imagenPath, (err) => {
          if (err) {
            console.error('Error al eliminar la imagen anterior:', err);
          }
        });
      }
    }

    const solicitudActualizada = await Solicitud.findByIdAndUpdate(id, updatedData, { new: true });
    if (!solicitudActualizada) {
      res.status(404).json({ message: 'Solicitud no encontrada' });
      return;
    }
    res.status(200).json(solicitudActualizada);
  } catch (error) {
    console.error('Error al actualizar la solicitud:', error);
    res.status(500).json({ message: 'Error al actualizar la solicitud' });
  }
};

// Eliminar una solicitud
export const eliminarSolicitud = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const solicitud = await Solicitud.findByIdAndDelete(id);
    if (!solicitud) {
      res.status(404).json({ message: 'Solicitud no encontrada' });
      return;
    }

    // Eliminar la imagen asociada si existe
    if (solicitud.imagen) {
      const imagenPath = path.resolve(__dirname, '../../../../uploads/', solicitud.imagen);
      fs.unlink(imagenPath, (err) => {
        if (err) {
          console.error('Error al eliminar la imagen:', err);
        }
      });
    }

    res.status(204).send(); // No content
  } catch (error) {
    console.error('Error al eliminar la solicitud:', error);
    res.status(500).json({ message: 'Error al eliminar la solicitud' });
  }
};

// Exportamos el middleware de multer para usarlo en las rutas
export { upload };
