// models/GestionTecnicos.model.ts
import mongoose, { Schema, Document } from 'mongoose';

interface IGestionTecnicos extends Document {
  solicitudId: mongoose.Types.ObjectId;
  tecnicoId: mongoose.Types.ObjectId;
  descripcion: string;
  estado: string;
  gastos?: number;
  diasDuracion?: number;
  comentarios?: string;
}

const GestionTecnicosSchema: Schema = new Schema({
  solicitudId: { type: Schema.Types.ObjectId, ref: 'Solicitud', required: true },
  tecnicoId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  descripcion: { type: String, required: true },
  estado: { type: String, required: true },
  gastos: { type: Number },
  diasDuracion: { type: Number },
  comentarios: { type: String }
});

export default mongoose.model<IGestionTecnicos>('GestionTecnicos', GestionTecnicosSchema);
