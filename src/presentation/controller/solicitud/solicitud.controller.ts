import { Request, Response } from 'express';
import Solicitud from '../../../mongo/models/solicitud.model';
import { storage } from '../../../mongo/firebase/firebase'; // Asegúrate de que la ruta sea correcta
import { v4 as uuidv4 } from 'uuid'; // Para generar nombres únicos
import multer from 'multer';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import mongoose from 'mongoose';

// Configuración de multer para manejar la subida de archivos
const multerStorage = multer.memoryStorage(); // Usamos memoria temporal para Firebase
const upload = multer({ storage: multerStorage });

// Crear una nueva solicitud con imagen
export const crearSolicitud = async (req: Request, res: Response): Promise<void> => {
  try {
    const { usuario_id, categoria, descripcion, telefono, departamento, ciudad, barrio, direccion, estado } = req.body;

    // Validar campos requeridos
    if (!usuario_id || !categoria || !descripcion || !departamento || !ciudad || !barrio || !direccion || !estado || !telefono) {
      res.status(400).json({ message: 'Todos los campos requeridos deben ser proporcionados' });
      return;
    }

    let imagenURL: string | undefined;

    // Verificar si se subió una imagen
    if (req.file) {
      const fileName = `${uuidv4()}-${req.file.originalname}`;
      const imageRef = ref(storage, fileName); // Creamos la referencia en Firebase

      // Subimos la imagen a Firebase Storage
      await uploadBytes(imageRef, req.file.buffer, {
        contentType: req.file.mimetype,
      });

      // Obtenemos la URL pública de la imagen
      imagenURL = await getDownloadURL(imageRef);
    }

    // Creamos la nueva solicitud en MongoDB
    const solicitud = new Solicitud({
      usuario_id,
      categoria,
      descripcion,
      imagen: imagenURL, // Guardamos la URL de la imagen en MongoDB
      telefono,
      departamento,
      ciudad,
      barrio,
      direccion,
      estado,
      fecha_creacion: new Date(),
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

    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ message: 'ID de solicitud no válido' });
      return;
    }

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

    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ message: 'ID de solicitud no válido' });
      return;
    }

    let imagenURL: string | undefined;

    if (req.file) {
      const solicitud = await Solicitud.findById(id);

      if (solicitud?.imagen) {
        const fileName = solicitud.imagen.split('/').pop()!.split('?')[0];
        const oldImageRef = ref(storage, decodeURIComponent(fileName));
        await deleteObject(oldImageRef).catch((err) => {
          console.error('Error al eliminar la imagen de Firebase:', err);
        });
      }

      const fileName = `${uuidv4()}-${req.file.originalname}`;
      const imageRef = ref(storage, fileName);

      await uploadBytes(imageRef, req.file.buffer, {
        contentType: req.file.mimetype,
      });

      imagenURL = await getDownloadURL(imageRef);
      updatedData.imagen = imagenURL;
    }

    const solicitudActualizada = await Solicitud.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

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

    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ message: 'ID de solicitud no válido' });
      return;
    }

    const solicitud = await Solicitud.findByIdAndDelete(id);
    if (!solicitud) {
      res.status(404).json({ message: 'Solicitud no encontrada' });
      return;
    }

    if (solicitud.imagen) {
      const fileName = solicitud.imagen.split('/').pop()!.split('?')[0];
      const imageRef = ref(storage, decodeURIComponent(fileName));
      await deleteObject(imageRef).catch((err) => {
        console.error('Error al eliminar la imagen de Firebase:', err);
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
