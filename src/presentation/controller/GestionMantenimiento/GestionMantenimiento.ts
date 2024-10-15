import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Solicitud from '../../../mongo/models/GestionMantenimiento'; // Asegúrate de que la importación sea correcta

// Obtener todas las solicitudes (filtrando por estados)
export const obtenerSolicitudes = async (req: Request, res: Response) => {
  try {
    const solicitudes = await Solicitud.find();
    res.json(solicitudes);
  } catch (error) {
    console.error('Error al obtener solicitudes:', error); // Agrega logs para la depuración
    res.status(500).json({ message: 'Error al obtener solicitudes' });
  }
};

// Actualizar una solicitud con gastos, días de duración, comentarios e ID del técnico
export const actualizarSolicitud = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { gastos, diasDuracion, comentarios, idTecnico } = req.body; // Añadido idTecnico

  // Validar que `id` es un ObjectId válido de MongoDB
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID de solicitud no válido' });
  }

  try {
    const solicitud = await Solicitud.findById(id);
    if (!solicitud) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }

    // Actualizar solo los campos recibidos, manteniendo los existentes si no se envían nuevos valores
    solicitud.gastos = gastos !== undefined ? gastos : solicitud.gastos;
    solicitud.diasDuracion = diasDuracion !== undefined ? diasDuracion : solicitud.diasDuracion;
    solicitud.comentarios = comentarios !== undefined ? comentarios : solicitud.comentarios;
    solicitud.idTecnico = idTecnico !== undefined ? idTecnico : solicitud.idTecnico; // Actualiza el idTecnico

    await solicitud.save();
    res.json({ message: 'Solicitud actualizada correctamente', solicitud });
  } catch (error) {
    console.error('Error al actualizar la solicitud:', error); // Agrega logs para la depuración
    res.status(500).json({ message: 'Error al actualizar la solicitud' });
  }
};

// Crear una nueva solicitud
export const crearSolicitud = async (req: Request, res: Response) => {
  const { descripcion, gastos, diasDuracion, comentarios, idTecnico } = req.body; // Añadido idTecnico

  if (!descripcion) {
    return res.status(400).json({ message: 'La descripción es obligatoria' });
  }

  try {
    // Crear una nueva solicitud con los datos proporcionados
    const nuevaSolicitud = new Solicitud({
      descripcion,
      gastos: gastos !== undefined ? gastos : 0,
      diasDuracion: diasDuracion !== undefined ? diasDuracion : 0,
      comentarios: comentarios !== undefined ? comentarios : '',
      idTecnico: idTecnico !== undefined ? idTecnico : null, // Guarda el ID del técnico
    });

    // Guardar la nueva solicitud en la base de datos
    await nuevaSolicitud.save();
    res.status(201).json({ message: 'Solicitud creada correctamente', nuevaSolicitud });
  } catch (error) {
    console.error('Error al crear la solicitud:', error); // Agrega logs para la depuración
    res.status(500).json({ message: 'Error al crear la solicitud' });
  }
};
