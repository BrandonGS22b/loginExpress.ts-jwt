// src/controllers/categoriaProblema.controller.ts
import { Request, Response } from 'express';
import CategoriaProblema from '../../../mongo/models/categoriaProblema.model';

export const crearCategoriaProblema = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre } = req.body;
    const categoriaProblema = new CategoriaProblema({ nombre });
    await categoriaProblema.save();
    res.status(201).json(categoriaProblema);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la categoría de problema' });
  }
};

export const obtenerCategoriasProblema = async (req: Request, res: Response): Promise<void> => {
  try {
    const categoriasProblema = await CategoriaProblema.find();
    res.status(200).json(categoriasProblema);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las categorías de problemas' });
  }
};

export const actualizarCategoriaProblema = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const categoriaActualizada = await CategoriaProblema.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(categoriaActualizada);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la categoría de problema' });
  }
};

export const eliminarCategoriaProblema = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await CategoriaProblema.findByIdAndDelete(id);
    res.status(200).json({ message: 'Categoría de problema eliminada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la categoría de problema' });
  }
};
