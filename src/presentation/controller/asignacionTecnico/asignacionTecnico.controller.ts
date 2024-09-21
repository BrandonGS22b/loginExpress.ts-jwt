// src/controllers/asignacionTecnico.controller.ts
import { Request, Response } from 'express';
import AsignacionTecnico from '../../../mongo/models/asignacionTecnico.model';

export const crearAsignacionTecnico = async (req: Request, res: Response): Promise<void> => {
  try {
    const asignacion = new AsignacionTecnico(req.body);
    await asignacion.save();
    res.status(201).json(asignacion);
  } catch (error) {
    res.status(500).json({ message: 'Error al asignar el técnico' });
  }
};

export const obtenerAsignacionesTecnico = async (req: Request, res: Response): Promise<void> => {
  try {
    const asignaciones = await AsignacionTecnico.find();
    res.status(200).json(asignaciones);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las asignaciones' });
  }
};

export const eliminarAsignacionTecnico = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await AsignacionTecnico.findByIdAndDelete(id);
    res.status(200).json({ message: 'Asignación de técnico eliminada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la asignación de técnico' });
  }
};
