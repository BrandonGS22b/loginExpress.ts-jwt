import mongoose, { Schema, Document } from 'mongoose';

export interface ISolicitud extends Document {
  usuario_id: mongoose.Types.ObjectId;
  categoria: string; 
  descripcion: string;
  imagen?: string;
  telefono?: string;
  departamento: string;
  ciudad: string;
  barrio: string;
  direccion: string;
  estado: 'Revisado' | 'En proceso' | 'Solucionado';
  fecha_creacion: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SolicitudSchema: Schema = new Schema({
  usuario_id: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
  categoria: {
    type: String,
    required: true,
  },
  descripcion: { type: String, required: true },
  imagen: { type: String, required: false },
  telefono: { type: String, required: true },
  departamento: { type: String, required: true },
  ciudad: { type: String, required: true },
  barrio: { type: String, required: true },
  direccion: { type: String, required: true },
  estado: {
    type: String,
    required: true,
    enum: ['Revisado', 'En proceso', 'Solucionado'],
  },
  fecha_creacion: { type: Date, default: Date.now },
}, { timestamps: true }); // Habilita los timestamps automáticos para createdAt y updatedAt

export default mongoose.model<ISolicitud>('Solicitud', SolicitudSchema);
