// models/GestionTecnicos.model.ts
import mongoose, { Schema, Document } from 'mongoose';

interface IGestionTecnicos extends Document {
  solicitudId: mongoose.Types.ObjectId;
  tecnicoId: mongoose.Types.ObjectId;
  descripcion: string;
  estado: string;
  gastos?: number;
  imagen?: string;
  diasDuracion?: number;
  comentarios?: string;
}

const GestionTecnicosSchema: Schema = new Schema({
  solicitudId: { type: Schema.Types.ObjectId, ref: 'Solicitud', required: false },
  tecnicoId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  descripcion: { type: String, required: false },
  estado: { type: String},
  gastos: { type: Number },
  imagen: { type: String, required: false },
  diasDuracion: { type: Number },
  comentarios: { type: String, required: false }
});

export default mongoose.model<IGestionTecnicos>('GestionTecnicos', GestionTecnicosSchema);
