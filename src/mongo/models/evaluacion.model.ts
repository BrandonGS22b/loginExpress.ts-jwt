// src/models/evaluacion.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IEvaluacion extends Document {
  solicitud_id: mongoose.Types.ObjectId;
  usuario_id: mongoose.Types.ObjectId;
  calificacion: number;
  comentario: string;
  fecha: Date;
}

const EvaluacionSchema: Schema = new Schema({
  solicitud_id: { type: Schema.Types.ObjectId, ref: 'Solicitud', required: true },
  usuario_id: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
  calificacion: { type: Number, min: 1, max: 5, required: true },
  comentario: { type: String, required: true },
  fecha: { type: Date, default: Date.now }
});

export default mongoose.model<IEvaluacion>('Evaluacion', EvaluacionSchema);
