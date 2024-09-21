// src/models/solicitud.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ISolicitud extends Document {
  usuario_id: mongoose.Types.ObjectId;
  categoria_id: mongoose.Types.ObjectId;
  descripcion: string;
  imagen: string;
  lugar: string;
  latitud: number;
  longitud: number;
  estado: 'Revisado' | 'En proceso' | 'Solucionado';
  fecha_creacion: Date;
}

const SolicitudSchema: Schema = new Schema({
  usuario_id: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
  categoria_id: { type: Schema.Types.ObjectId, ref: 'CategoriaProblema', required: true },
  descripcion: { type: String, required: true },
  imagen: { type: String },
  lugar: { type: String },
  latitud: { type: Number },
  longitud: { type: Number },
  estado: { type: String, required: true },
  fecha_creacion: { type: Date, default: Date.now },
});

export default mongoose.model<ISolicitud>('Solicitud', SolicitudSchema);
