// src/models/asignacionTecnico.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IAsignacionTecnico extends Document {
  solicitud_id: mongoose.Types.ObjectId;
  tecnico_id: mongoose.Types.ObjectId;
  fecha_asignacion: Date;
}

const AsignacionTecnicoSchema: Schema = new Schema({
  solicitud_id: { type: Schema.Types.ObjectId, ref: 'Solicitud', required: true },
  tecnico_id: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
  fecha_asignacion: { type: Date, default: Date.now }
});

export default mongoose.model<IAsignacionTecnico>('AsignacionTecnico', AsignacionTecnicoSchema);
