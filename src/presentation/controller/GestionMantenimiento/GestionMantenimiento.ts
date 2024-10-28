import { Request, Response } from 'express';
import mongoose from 'mongoose';
import GestionMantenimiento from '../../../mongo/models/GestionMantenimiento'; // Asegúrate de que la importación sea correcta

// Obtener todos los mantenimientos
export const obtenerMantenimientos = async (req: Request, res: Response) => {
  try {
    const mantenimientos = await GestionMantenimiento.find();
    res.json(mantenimientos);
  } catch (error) {
    console.error('Error al obtener mantenimientos:', error); // Agrega logs para la depuración
    res.status(500).json({ message: 'Error al obtener mantenimientos' });
  }
};

// Actualizar un mantenimiento con gastos, días de duración, comentarios e ID del técnico
export const actualizarMantenimiento = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { gastos, diasDuracion, comentarios, idTecnico } = req.body; // Añadido idTecnico

  // Validar que `id` es un ObjectId válido de MongoDB
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID de mantenimiento no válido' });
  }

  try {
    const mantenimiento = await GestionMantenimiento.findById(id);
    if (!mantenimiento) {
      return res.status(404).json({ message: 'Mantenimiento no encontrado' });
    }

    // Actualizar solo los campos recibidos, manteniendo los existentes si no se envían nuevos valores
    mantenimiento.gastos = gastos !== undefined ? gastos : mantenimiento.gastos;
    mantenimiento.diasDuracion = diasDuracion !== undefined ? diasDuracion : mantenimiento.diasDuracion;
    mantenimiento.comentarios = comentarios !== undefined ? comentarios : mantenimiento.comentarios;
    mantenimiento.idTecnico = idTecnico !== undefined ? idTecnico : mantenimiento.idTecnico; // Actualiza el idTecnico

    await mantenimiento.save();
    res.json({ message: 'Mantenimiento actualizado correctamente', mantenimiento });
  } catch (error) {
    console.error('Error al actualizar el mantenimiento:', error); // Agrega logs para la depuración
    res.status(500).json({ message: 'Error al actualizar el mantenimiento' });
  }
};

// Crear una nueva solicitud
export const crearMantenimiento = async (req: Request, res: Response) => {
  const { descripcion, gastos, diasDuracion, comentarios, idTecnico } = req.body; // Añadido idTecnico

  if (!descripcion || !idTecnico) {
    return res.status(400).json({ message: 'La descripción y el ID del técnico son obligatorios' });
  }

  // Validar que `idTecnico` es un ObjectId válido de MongoDB
  if (!mongoose.Types.ObjectId.isValid(idTecnico)) {
    return res.status(400).json({ message: 'ID de técnico no válido' });
  }

  try {
    // Crear una nueva solicitud con los datos proporcionados
    const nuevoMantenimiento = new GestionMantenimiento({
      descripcion,
      gastos: gastos !== undefined ? gastos : 0,
      diasDuracion: diasDuracion !== undefined ? diasDuracion : 0,
      comentarios: comentarios !== undefined ? comentarios : '',
      idTecnico: idTecnico, // Guarda el ID del técnico
    });

    // Guardar la nueva solicitud en la base de datos
    await nuevoMantenimiento.save();
    res.status(201).json({ message: 'Mantenimiento creado correctamente', nuevoMantenimiento });
  } catch (error) {
    console.error('Error al crear el mantenimiento:', error); // Agrega logs para la depuración
    res.status(500).json({ message: 'Error al crear el mantenimiento' });
  }
};
