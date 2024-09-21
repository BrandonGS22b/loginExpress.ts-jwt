// src/controllers/historialMantenimiento.controller.ts
import { Request, Response } from 'express';
import HistorialMantenimiento from '../../../mongo/models/historialMantenimiento.model';

export const crearHistorialMantenimiento = async (req: Request, res: Response): Promise<void> => {
  try {
    const historialMantenimiento = new HistorialMantenimiento(req.body);
    await historialMantenimiento.save();
    res.status(201).json(historialMantenimiento);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el historial de mantenimiento' });
  }
};

export const obtenerHistorialesMantenimiento = async (req: Request, res: Response): Promise<void> => {
  try {
    const historiales = await HistorialMantenimiento.find();
    res.status(200).json(historiales);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los historiales de mantenimiento' });
  }
};

export const eliminarHistorialMantenimiento = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await HistorialMantenimiento.findByIdAndDelete(id);
    res.status(200).json({ message: 'Historial de mantenimiento eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el historial de mantenimiento' });
  }
};
