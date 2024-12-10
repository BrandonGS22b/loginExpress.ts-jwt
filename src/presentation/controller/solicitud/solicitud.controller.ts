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

    // Validar que el ID sea válido
    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ message: 'ID de solicitud no válido' });
      return;
    }

    // Inicializar una variable para almacenar la URL de la imagen si se carga una nueva
    let imagenURL: string | undefined;

    // Comprobar si se ha subido una imagen
    if (req.file) {
      const solicitud = await Solicitud.findById(id);

      // Si la solicitud tiene una imagen anterior, se elimina de Firebase
      if (solicitud?.imagen) {
        const fileName = solicitud.imagen.split('/').pop()!.split('?')[0];
        const oldImageRef = ref(storage, decodeURIComponent(fileName));
        await deleteObject(oldImageRef).catch((err) => {
          console.error('Error al eliminar la imagen de Firebase:', err);
        });
      }

      // Subir la nueva imagen a Firebase
      const fileName = `${uuidv4()}-${req.file.originalname}`;
      const imageRef = ref(storage, fileName);

      await uploadBytes(imageRef, req.file.buffer, {
        contentType: req.file.mimetype,
      });

      // Obtener la URL de la imagen subida
      imagenURL = await getDownloadURL(imageRef);
      updatedData.imagen = imagenURL; // Agregar la URL de la imagen a los datos de actualización
    }

    // Actualizar la solicitud en la base de datos con los datos de `updatedData`
    const solicitudActualizada = await Solicitud.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    // Verificar si la solicitud fue encontrada y actualizada
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

// Eliminar una solicitud (y la imagen asociada si existe)
export const eliminarSolicitud = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Validar el ID de la solicitud
    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ message: 'ID de solicitud no válido' });
      return;
    }

    const solicitud = await Solicitud.findById(id);

    // Verificar si la solicitud existe y tiene una imagen
    if (solicitud?.imagen) {
      const fileName = solicitud.imagen.split('/').pop()!.split('?')[0];
      const imageRef = ref(storage, decodeURIComponent(fileName));

      // Eliminar la imagen de Firebase
      await deleteObject(imageRef).catch((err) => {
        console.error('Error al eliminar la imagen de Firebase:', err);
      });
    }

    // Eliminar la solicitud de la base de datos
    const solicitudEliminada = await Solicitud.findByIdAndDelete(id);

    // Verificar si la solicitud fue eliminada
    if (!solicitudEliminada) {
      res.status(404).json({ message: 'Solicitud no encontrada' });
      return;
    }

    res.status(200).json({ message: 'Solicitud eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar la solicitud:', error);
    res.status(500).json({ message: 'Error al eliminar la solicitud' });
  }
};
