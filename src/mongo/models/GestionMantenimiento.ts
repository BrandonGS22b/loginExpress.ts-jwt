import mongoose, { Schema, Document } from 'mongoose';
//este es el de historiamantenimiento
interface IGestionMantenimiento extends Document {
  descripcion: string;
  gastos: number;
  diasDuracion: number;
  comentarios: string;
  idTecnico: mongoose.Types.ObjectId; // Agregado para almacenar el ID del técnico
  solicitudId: mongoose.Types.ObjectId; // Agregado para almacenar el ID de la solicitud
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
  idTecnico: {
    type: mongoose.Types.ObjectId,
    ref: 'Usuario', // Referencia al modelo de Usuario
    required: true,
  },
  solicitudId: {
    type: mongoose.Types.ObjectId,
    ref: 'Solicitud', // Asegúrate de que esto coincida con el nombre de tu modelo de solicitud
    required: true,
  },
  // Otros campos adicionales de la solicitud
});

// Cambiar el nombre del modelo a "GestionMantenimiento"
const GestionMantenimiento = mongoose.model<IGestionMantenimiento>('GestionMantenimiento', GestionMantenimientoSchema);
export default GestionMantenimiento;
