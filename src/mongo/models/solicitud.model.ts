import mongoose, { Schema, Document } from 'mongoose';

export interface ISolicitud extends Document {
  usuario_id: mongoose.Types.ObjectId;
  categoria_id: mongoose.Types.ObjectId;
  descripcion: string;
  imagen?: string;
  lugar?: string;
  latitud?: number;
  longitud?: number;
  estado: 'Revisado' | 'En proceso' | 'Solucionado';
  fecha_creacion: Date;
  createdAt: Date;  // Corregido el nombre
  updatedAt: Date;  // Corregido el nombre
}

const SolicitudSchema: Schema = new Schema({
  usuario_id: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
  categoria_id: { type: Schema.Types.ObjectId, ref: 'CategoriaProblema', required: true },
  descripcion: { type: String, required: true },
  imagen: { type: String, required: false },  // Imagen opcional
  lugar: { type: String, required: false },   // Lugar opcional
  latitud: {
    type: Number,
    required: false,  // Opcional
    validate: {
      validator: function (v: number) {
        return v >= -90 && v <= 90;
      },
      message: (props: { value: number }) => `${props.value} no es una latitud válida. Debe estar entre -90 y 90.`, // Añadido tipo
    },
  },
  longitud: {
    type: Number,
    required: false,  // Opcional
    validate: {
      validator: function (v: number) {
        return v >= -180 && v <= 180;
      },
      message: (props: { value: number }) => `${props.value} no es una longitud válida. Debe estar entre -180 y 180.`, // Añadido tipo
    },
  },
  estado: {
    type: String,
    required: true,
    enum: ['Revisado', 'En proceso', 'Solucionado'], // Valida que solo acepte estos valores
  },
  fecha_creacion: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },  // Corregido el nombre
  updatedAt: { type: Date, default: Date.now },  // Corregido el nombre
});

// Middleware para actualizar el campo updatedAt antes de guardar
SolicitudSchema.pre('save', function (next) {
  this.set('updatedAt', new Date());  // Uso de this.set para actualizar
  next();
});

export default mongoose.model<ISolicitud>('Solicitud', SolicitudSchema);
