// controllers/GestionTecnicosController.ts
import { Request, Response } from 'express';
import GestionTecnicos from '../../../mongo/models/GestionTecnicos.model';
import { storage } from '../../../mongo/firebase/firebase'; // Asegúrate de que la ruta sea correcta
import { v4 as uuidv4 } from 'uuid'; // Para generar nombres únicos
import multer from 'multer';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import mongoose from 'mongoose';

// Configuración de multer para manejar la subida de archivos
const multerStorage = multer.memoryStorage(); // Usamos memoria temporal para Firebase
const upload = multer({ storage: multerStorage });

// Crear una nueva asignación con imagen
export const crearAsignacion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { solicitudId, tecnicoId, descripcion, estado, gastos, diasDuracion, comentarios } = req.body;

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

    // Crear la nueva asignación en MongoDB
    const nuevaAsignacion = new GestionTecnicos({
      solicitudId,
      tecnicoId,
      descripcion,
      estado,
      gastos,
      diasDuracion,
      comentarios,
      imagen: imagenURL, // Guardamos la URL de la imagen en MongoDB
    });

    const asignacionGuardada = await nuevaAsignacion.save();
    res.status(201).json(asignacionGuardada);
  } catch (error) {
    console.error('Error al crear la asignación:', error);
    res.status(500).json({ message: 'Error al crear la asignación' });
  }
};
export const obtenerAsignacionesPorTecnico = async (req: Request, res: Response) => {
  try {
    const { tecnicoId } = req.params;

    // Verificar que el ID del técnico sea un ObjectId válido
    if (!mongoose.isValidObjectId(tecnicoId)) {
      return res.status(400).json({ message: 'ID de técnico no válido' });
    }

    // Buscar asignaciones para el técnico específico
    const asignaciones = await GestionTecnicos.find({ tecnicoId: new mongoose.Types.ObjectId(tecnicoId) });

    // Verificar si se encontraron asignaciones
    if (asignaciones.length === 0) {
      return res.status(404).json({ message: 'No se encontraron asignaciones para este técnico' });
    }

    res.json(asignaciones);
  } catch (error) {
    console.error('Error al obtener asignaciones:', error);
    res.status(500).json({ message: 'Error al obtener asignaciones', error });
  }
};
// Obtener todas las asignaciones (incluyendo imágenes)
export const obtenerTodasAsignaciones = async (req: Request, res: Response): Promise<void> => {
  try {
    const asignaciones = await GestionTecnicos.find();
    res.status(200).json(asignaciones);
  } catch (error) {
    console.error('Error al obtener las asignaciones:', error);
    res.status(500).json({ message: 'Error al obtener las asignaciones' });
  }
};

// Actualizar una asignación (opcionalmente con una nueva imagen)
export const actualizarAsignacion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    // Validar que el ID sea válido
    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ message: 'ID de asignación no válido' });
      return;
    }

    let imagenURL: string | undefined;

    // Comprobar si se ha subido una imagen
    if (req.file) {
      const asignacion = await GestionTecnicos.findById(id);

      // Si la asignación tiene una imagen anterior, se elimina de Firebase
      if (asignacion?.imagen) {
        const fileName = asignacion.imagen.split('/').pop()!.split('?')[0];
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

    // Actualizar la asignación en la base de datos
    const asignacionActualizada = await GestionTecnicos.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!asignacionActualizada) {
      res.status(404).json({ message: 'Asignación no encontrada' });
      return;
    }

    res.status(200).json(asignacionActualizada);
  } catch (error) {
    console.error('Error al actualizar la asignación:', error);
    res.status(500).json({ message: 'Error al actualizar la asignación' });
  }
};

// Eliminar una asignación
export const eliminarAsignacion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ message: 'ID de asignación no válido' });
      return;
    }

    const asignacion = await GestionTecnicos.findByIdAndDelete(id);
    if (!asignacion) {
      res.status(404).json({ message: 'Asignación no encontrada' });
      return;
    }

    if (asignacion.imagen) {
      const fileName = asignacion.imagen.split('/').pop()!.split('?')[0];
      const imageRef = ref(storage, decodeURIComponent(fileName));
      await deleteObject(imageRef).catch((err) => {
        console.error('Error al eliminar la imagen de Firebase:', err);
      });
    }

    res.status(204).send(); // No content
  } catch (error) {
    console.error('Error al eliminar la asignación:', error);
    res.status(500).json({ message: 'Error al eliminar la asignación' });
  }
};

// Exportamos el middleware de multer para usarlo en las rutas
export { upload };
