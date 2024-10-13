import { Request, Response } from 'express';
import Solicitud from '../../../mongo/models/solicitud.model';
import multer from 'multer';
import mongoose from 'mongoose';
import { getStorage } from 'firebase-admin/storage';
import { v4 as uuidv4 } from 'uuid'; // Para generar nombres únicos
import bucket from '../../../mongo/firebase/firebase'; // Asegúrate de que la ruta sea correcta

// Configuración de multer para manejar la subida de archivos
const storage = multer.memoryStorage(); // Usamos memoria temporal para Firebase
const upload = multer({ storage });

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
      const blob = bucket.file(`${uuidv4()}-${req.file.originalname}`); // Crear un archivo único en Firebase
      const blobStream = blob.createWriteStream({
        metadata: {
          contentType: req.file.mimetype,
        },
      });

      blobStream.on('error', (error) => {
        console.error('Error al subir la imagen a Firebase:', error);
        res.status(500).json({ message: 'Error al subir la imagen' });
        return;
      });

      blobStream.on('finish', async () => {
        imagenURL = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(blob.name)}?alt=media`;

        const solicitud = new Solicitud({
          usuario_id,
          categoria,
          descripcion,
          imagen: imagenURL, // Guardamos la URL de la imagen
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
      });

      blobStream.end(req.file.buffer); // Finalizamos la subida de la imagen
    } else {
      // Si no hay imagen, simplemente guarda la solicitud sin imagen
      const solicitud = new Solicitud({
        usuario_id,
        categoria,
        descripcion,
        imagen: imagenURL, // Puede ser undefined si no hay imagen
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
    }
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

    // Verificar si el ID es un ObjectId válido
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

    // Verificar si el ID es un ObjectId válido
    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ message: 'ID de solicitud no válido' });
      return;
    }

    // Verificar si se subió una nueva imagen
    if (req.file) {
      const solicitud = await Solicitud.findById(id);

      if (solicitud?.imagen) {
        // Eliminar la imagen anterior en Firebase si existe
        const fileName = decodeURIComponent(solicitud.imagen.split('/').pop()!.split('?')[0]);
        await bucket.file(fileName).delete().catch((err) => {
          console.error('Error al eliminar la imagen de Firebase:', err);
        });
      }

      const blob = bucket.file(`${uuidv4()}-${req.file.originalname}`);
      const blobStream = blob.createWriteStream({
        metadata: {
          contentType: req.file.mimetype,
        },
      });

      blobStream.on('error', (error) => {
        console.error('Error al subir la imagen a Firebase:', error);
        res.status(500).json({ message: 'Error al subir la imagen' });
        return;
      });

      blobStream.on('finish', async () => {
        updatedData.imagen = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(blob.name)}?alt=media`;

        const solicitudActualizada = await Solicitud.findByIdAndUpdate(id, updatedData, {
          new: true,
          runValidators: true,
        });

        if (!solicitudActualizada) {
          res.status(404).json({ message: 'Solicitud no encontrada' });
          return;
        }

        res.status(200).json(solicitudActualizada);
      });

      blobStream.end(req.file.buffer);
    } else {
      const solicitudActualizada = await Solicitud.findByIdAndUpdate(id, updatedData, {
        new: true,
        runValidators: true,
      });

      if (!solicitudActualizada) {
        res.status(404).json({ message: 'Solicitud no encontrada' });
        return;
      }

      res.status(200).json(solicitudActualizada);
    }
  } catch (error) {
    console.error('Error al actualizar la solicitud:', error);
    res.status(500).json({ message: 'Error al actualizar la solicitud' });
  }
};

// Eliminar una solicitud
export const eliminarSolicitud = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Verificar si el ID es un ObjectId válido
    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ message: 'ID de solicitud no válido' });
      return;
    }

    const solicitud = await Solicitud.findByIdAndDelete(id);
    if (!solicitud) {
      res.status(404).json({ message: 'Solicitud no encontrada' });
      return;
    }

    // Eliminar la imagen asociada si existe
    if (solicitud.imagen) {
      const fileName = decodeURIComponent(solicitud.imagen.split('/').pop()!.split('?')[0]);
      await bucket.file(fileName).delete().catch((err) => {
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
