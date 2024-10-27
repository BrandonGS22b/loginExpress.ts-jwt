import mongoose, { Schema, Document } from 'mongoose';

interface IGestionMantenimiento extends Document {
  descripcion: string;
  gastos: number;
  diasDuracion: number;
  comentarios: string;
  idTecnico: mongoose.Types.ObjectId; // Agregado para almacenar el ID del técnico
}

const GestionMantenimientoSchema: Schema = new Schema({
  gastos: {
    type: Number,
    default: 0,
  },
  diasDuracion: {
    type: Number,
    default: 0,
  },
  comentarios: {
    type: String,
    default: '',
  },
  idTecnico: {
    type: mongoose.Types.ObjectId,
    ref: 'Usuario', // Referencia al modelo de Usuario
    required: true,
  },
  // Otros campos adicionales de la solicitud
});

// Cambiar el nombre del modelo a "GestionMantenimiento"
const GestionMantenimiento = mongoose.model<IGestionMantenimiento>('GestionMantenimiento', GestionMantenimientoSchema);
export default GestionMantenimiento;
