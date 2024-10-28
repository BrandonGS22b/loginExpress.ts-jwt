import { Request, Response } from 'express';
import mongoose from 'mongoose';
import GestionMantenimiento from '../../../mongo/models/GestionMantenimiento';

// Obtener todos los mantenimientos
export const obtenerMantenimientos = async (req: Request, res: Response) => {
  try {
    const mantenimientos = await GestionMantenimiento.find();
    res.json(mantenimientos);
  } catch (error) {
    console.error('Error al obtener mantenimientos:', error);
    res.status(500).json({ message: 'Error al obtener mantenimientos' });
  }
};

// Actualizar un mantenimiento con gastos, días de duración, comentarios, idTecnico y solicitudId
export const actualizarMantenimiento = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { gastos, diasDuracion, comentarios, idTecnico, solicitudId } = req.body;

  // Validar que `id` es un ObjectId válido de MongoDB
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID de mantenimiento no válido' });
  }

  // Validar que `idTecnico` y `solicitudId`, si están presentes, sean ObjectId válidos
  if (idTecnico && !mongoose.Types.ObjectId.isValid(idTecnico)) {
    return res.status(400).json({ message: 'ID de técnico no válido' });
  }
  if (solicitudId && !mongoose.Types.ObjectId.isValid(solicitudId)) {
    return res.status(400).json({ message: 'ID de solicitud no válido' });
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
    mantenimiento.idTecnico = idTecnico !== undefined ? idTecnico : mantenimiento.idTecnico;
    mantenimiento.solicitudId = solicitudId !== undefined ? solicitudId : mantenimiento.solicitudId;

    await mantenimiento.save();
    res.json({ message: 'Mantenimiento actualizado correctamente', mantenimiento });
  } catch (error) {
    console.error('Error al actualizar el mantenimiento:', error);
    res.status(500).json({ message: 'Error al actualizar el mantenimiento' });
  }
};

// Crear un nuevo mantenimiento
export const crearMantenimiento = async (req: Request, res: Response) => {
  const { descripcion, gastos, diasDuracion, comentarios, idTecnico, solicitudId } = req.body;

  if (!descripcion || !idTecnico || !solicitudId) {
    return res.status(400).json({ message: 'La descripción, el ID del técnico y el ID de la solicitud son obligatorios' });
  }

  // Validar que `idTecnico` y `solicitudId` son ObjectId válidos
  if (!mongoose.Types.ObjectId.isValid(idTecnico)) {
    return res.status(400).json({ message: 'ID de técnico no válido' });
  }
  if (!mongoose.Types.ObjectId.isValid(solicitudId)) {
    return res.status(400).json({ message: 'ID de solicitud no válido' });
  }

  try {
    // Crear un nuevo mantenimiento con los datos proporcionados
    const nuevoMantenimiento = new GestionMantenimiento({
      descripcion,
      gastos: gastos !== undefined ? gastos : 0,
      diasDuracion: diasDuracion !== undefined ? diasDuracion : 0,
      comentarios: comentarios !== undefined ? comentarios : '',
      idTecnico,
      solicitudId,
    });

    // Guardar el nuevo mantenimiento en la base de datos
    await nuevoMantenimiento.save();
    res.status(201).json({ message: 'Mantenimiento creado correctamente', nuevoMantenimiento });
  } catch (error) {
    console.error('Error al crear el mantenimiento:', error);
    res.status(500).json({ message: 'Error al crear el mantenimiento' });
  }
};
