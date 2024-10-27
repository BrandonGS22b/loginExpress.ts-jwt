// controllers/GestionTecnicosController.ts
import { Request, Response } from 'express';
import GestionTecnicos from '../../../mongo/models/GestionTecnicos.model';

export const crearAsignacion = async (req: Request, res: Response) => {
  try {
    const { solicitudId, tecnicoId, descripcion, estado, gastos, diasDuracion, comentarios } = req.body;
    const nuevaAsignacion = new GestionTecnicos({ solicitudId, tecnicoId, descripcion, estado, gastos, diasDuracion, comentarios });
    await nuevaAsignacion.save();
    res.status(201).json({ message: 'Asignación creada correctamente', data: nuevaAsignacion });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la asignación', error });
  }
};

export const obtenerAsignacionesPorTecnico = async (req: Request, res: Response) => {
  try {
    const { tecnicoId } = req.params;
    const asignaciones = await GestionTecnicos.find({ tecnicoId });
    res.json(asignaciones);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener asignaciones', error });
  }
};
