// src/controllers/mantenimiento.controller.ts
import { Request, Response } from 'express';
import Mantenimiento from '../../../mongo/models/mantenimiento.model';

export const crearMantenimiento = async (req: Request, res: Response): Promise<void> => {
  try {
    const mantenimiento = new Mantenimiento(req.body);
    await mantenimiento.save();
    res.status(201).json(mantenimiento);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el mantenimiento' });
  }
};

export const obtenerMantenimientos = async (req: Request, res: Response): Promise<void> => {
  try {
    const mantenimientos = await Mantenimiento.find();
    res.status(200).json(mantenimientos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los mantenimientos' });
  }
};

export const actualizarMantenimiento = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const mantenimientoActualizado = await Mantenimiento.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(mantenimientoActualizado);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el mantenimiento' });
  }
};

export const eliminarMantenimiento = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await Mantenimiento.findByIdAndDelete(id);
    res.status(200).json({ message: 'Mantenimiento eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el mantenimiento' });
  }
};
