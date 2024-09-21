// src/controllers/mensaje.controller.ts
import { Request, Response } from 'express';
import Mensaje from '../../../mongo/models/mensaje.model';

export const crearMensaje = async (req: Request, res: Response): Promise<void> => {
  try {
    const mensaje = new Mensaje(req.body);
    await mensaje.save();
    res.status(201).json(mensaje);
  } catch (error) {
    res.status(500).json({ message: 'Error al enviar el mensaje' });
  }
};

export const obtenerMensajes = async (req: Request, res: Response): Promise<void> => {
  try {
    const mensajes = await Mensaje.find();
    res.status(200).json(mensajes);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los mensajes' });
  }
};

export const eliminarMensaje = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await Mensaje.findByIdAndDelete(id);
    res.status(200).json({ message: 'Mensaje eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el mensaje' });
  }
};
