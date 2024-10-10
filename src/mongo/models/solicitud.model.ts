import mongoose, { Schema, Document } from 'mongoose';

export interface ISolicitud extends Document {
  usuario_id: mongoose.Types.ObjectId;
  categoria: string; // Ahora la categoría es un string con valores predefinidos
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
    //enum: ['Fuga de agua', 'Daño eléctrico', 'Bache en la vía', 'Otro problema'], // Categorías predefinidas
  },
  descripcion: { type: String, required: true },
  imagen: { type: String, required: false },  // Imagen opcional
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
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Middleware para actualizar el campo updatedAt antes de guardar
SolicitudSchema.pre('save', function (next) {
  this.set('updatedAt', new Date());
  next();
});

export default mongoose.model<ISolicitud>('Solicitud', SolicitudSchema);
