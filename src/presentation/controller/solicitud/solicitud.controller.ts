// src/controllers/solicitud.controller.ts
import { Request, Response } from 'express';
import Solicitud, { ISolicitud } from '../../../mongo/models/solicitud.model';

export const crearSolicitud = async (req: Request, res: Response): Promise<void> => {
  try {
    const { usuario_id, categoria_id, descripcion, imagen, lugar, latitud, longitud, estado } = req.body;
    const solicitud = new Solicitud({ usuario_id, categoria_id, descripcion, imagen, lugar, latitud, longitud, estado });
    await solicitud.save();
    res.status(201).json(solicitud);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la solicitud' });
  }
};

// Otros métodos CRUD...
