// src/models/mantenimiento.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IMantenimiento extends Document {
  solicitud_id: mongoose.Types.ObjectId;
  tecnico_id: mongoose.Types.ObjectId;
  descripcion: string;
  fecha_mantenimiento: Date;
  evidencia: string;
  estado: 'Completado' | 'Pendiente' | 'No realizado';
}

const MantenimientoSchema: Schema = new Schema({
  solicitud_id: { type: Schema.Types.ObjectId, ref: 'Solicitud', required: true },
  tecnico_id: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
  descripcion: { type: String, required: true },
  fecha_mantenimiento: { type: Date, default: Date.now },
  evidencia: { type: String },
  estado: { type: String, required: true }
});

export default mongoose.model<IMantenimiento>('Mantenimiento', MantenimientoSchema);
