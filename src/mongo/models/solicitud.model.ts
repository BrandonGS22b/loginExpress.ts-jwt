import mongoose, { Schema, Document } from 'mongoose';

export interface ISolicitud extends Document {
  usuario_id: mongoose.Types.ObjectId;
  categoria_id: mongoose.Types.ObjectId;
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
  categoria_id: { type: Schema.Types.ObjectId, ref: 'CategoriaProblema', required: true },
  descripcion: { type: String, required: true },
  imagen: { type: String, required: false },  // Imagen opcional
  telefono:{ type: String, required: true},
  departamento: { type: String, required: true }, // Campo requerido
  ciudad: { type: String, required: true },     // Campo requerido
  barrio: { type: String, required: true },     // Campo requerido
  direccion: { type: String, required: true },  // Campo requerido
  estado: {
    type: String,
    required: true,
    enum: ['Revisado', 'En proceso', 'Solucionado'],
  },
  fecha_creacion: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Middleware para actualizar el campo updatedAt antes de guardar
SolicitudSchema.pre('save', function (next) {
  this.set('updatedAt', new Date());
  next();
});

export default mongoose.model<ISolicitud>('Solicitud', SolicitudSchema);
