import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Solicitud from '../../../mongo/models/GestionMantenimiento';  // Importación correcta del modelo

// Obtener todas las solicitudes (filtrando por estados)
export const obtenerSolicitudes = async (req: Request, res: Response) => {
  try {
    const solicitudes = await Solicitud.find();
    res.json(solicitudes);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener solicitudes' });
  }
};

// Actualizar una solicitud con gastos, días de duración y comentarios
export const actualizarSolicitud = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { gastos, diasDuracion, comentarios } = req.body;

  // Validar que `id` es un ObjectId válido de MongoDB
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID de solicitud no válido' });
  }

  try {
    const solicitud = await Solicitud.findById(id);
    if (!solicitud) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }

    // Actualizamos solo los campos recibidos, manteniendo los existentes si no se envían nuevos valores
    solicitud.gastos = gastos ?? solicitud.gastos;
    solicitud.diasDuracion = diasDuracion ?? solicitud.diasDuracion;
    solicitud.comentarios = comentarios ?? solicitud.comentarios;

    await solicitud.save();
    res.json({ message: 'Solicitud actualizada correctamente', solicitud });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la solicitud' });
  }
};


//para creat

export const crearSolicitud = async (req: Request, res: Response) => {
  const { descripcion, gastos, diasDuracion, comentarios } = req.body;

  if (!descripcion) {
    return res.status(400).json({ message: 'La descripción es obligatoria' });
  }

  try {
    // Crear una nueva solicitud con los datos proporcionados
    const nuevaSolicitud = new Solicitud({
      descripcion,
      gastos: gastos ?? 0,
      diasDuracion: diasDuracion ?? 0,
      comentarios: comentarios ?? ''
    });

    // Guardar la nueva solicitud en la base de datos
    await nuevaSolicitud.save();
    res.status(201).json({ message: 'Solicitud creada correctamente', nuevaSolicitud });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la solicitud' });
  }
};

