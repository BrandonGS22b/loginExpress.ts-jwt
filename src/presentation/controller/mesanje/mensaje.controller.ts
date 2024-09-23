import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Mensaje from '../../../mongo/models/mensaje.model';
import Solicitud from '../../../mongo/models/solicitud.model'; // Asegúrate de importar el modelo de Solicitud

// Controlador para crear un nuevo mensaje
export const crearMensaje = async (req: Request, res: Response): Promise<void> => {
  try {
    const { solicitud_id, emisor_id, receptor_id, contenido } = req.body;

    // Verificar si el solicitud_id es un ObjectId válido
    if (!mongoose.isValidObjectId(solicitud_id)) {
      res.status(400).json({ message: 'ID de solicitud no válido.' });
      return;
    }

    // Verificar si la solicitud con ese ID existe
    const solicitud = await Solicitud.findById(solicitud_id);
    if (!solicitud) {
      res.status(404).json({ message: 'Solicitud no encontrada.' });
      return;
    }

    // Crear el nuevo mensaje
    const nuevoMensaje = new Mensaje({
      solicitud_id,
      emisor_id,
      receptor_id,
      contenido
    });

    // Guardar el mensaje en la base de datos
    await nuevoMensaje.save();
    res.status(201).json(nuevoMensaje);

  } catch (error) {
    res.status(500).json({ message: 'Error al enviar el mensaje' });
  }
};

// Controlador para obtener todos los mensajes
export const obtenerMensajes = async (req: Request, res: Response): Promise<void> => {
  try {
    const mensajes = await Mensaje.find();
    res.status(200).json(mensajes);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los mensajes' });
  }
};

// Controlador para eliminar un mensaje
export const eliminarMensaje = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Verificar si el ID del mensaje es válido
    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ message: 'ID de mensaje no válido.' });
      return;
    }

    const mensajeEliminado = await Mensaje.findByIdAndDelete(id);

    if (!mensajeEliminado) {
      res.status(404).json({ message: 'Mensaje no encontrado.' });
      return;
    }

    res.status(200).json({ message: 'Mensaje eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el mensaje' });
  }
};
