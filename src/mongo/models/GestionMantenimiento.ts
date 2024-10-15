import mongoose, { Schema, Document } from 'mongoose';

interface IGestionMantenimiento extends Document {
  descripcion: string;
  gastos: number;
  diasDuracion: number;
  comentarios: string;
}

const GestionMantenimientoSchema: Schema = new Schema({
  descripcion: {
    type: String,
    required: true,
  },
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
  // Otros campos adicionales de la solicitud
});

// Cambiar el nombre del modelo a "GestionMantenimiento"
const GestionMantenimiento = mongoose.model<IGestionMantenimiento>('GestionMantenimiento', GestionMantenimientoSchema);
export default GestionMantenimiento;
