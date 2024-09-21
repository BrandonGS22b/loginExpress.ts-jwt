// src/models/historialMantenimiento.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IHistorialMantenimiento extends Document {
  mantenimiento_id: mongoose.Types.ObjectId;
  justificacion: string;
  fecha: Date;
}

const HistorialMantenimientoSchema: Schema = new Schema({
  mantenimiento_id: { type: Schema.Types.ObjectId, ref: 'Mantenimiento', required: true },
  justificacion: { type: String, required: true },
  fecha: { type: Date, default: Date.now }
});

export default mongoose.model<IHistorialMantenimiento>('HistorialMantenimiento', HistorialMantenimientoSchema);
