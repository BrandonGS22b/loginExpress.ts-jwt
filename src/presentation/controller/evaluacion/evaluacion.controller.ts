// src/controllers/evaluacion.controller.ts
import { Request, Response } from 'express';
import Evaluacion from '../../../mongo/models/evaluacion.model';

export const crearEvaluacion = async (req: Request, res: Response): Promise<void> => {
  try {
    const evaluacion = new Evaluacion(req.body);
    await evaluacion.save();
    res.status(201).json(evaluacion);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la evaluación' });
  }
};

export const obtenerEvaluaciones = async (req: Request, res: Response): Promise<void> => {
  try {
    const evaluaciones = await Evaluacion.find();
    res.status(200).json(evaluaciones);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las evaluaciones' });
  }
};

export const eliminarEvaluacion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await Evaluacion.findByIdAndDelete(id);
    res.status(200).json({ message: 'Evaluación eliminada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la evaluación' });
  }
};
