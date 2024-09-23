// src/models/mensaje.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IMensaje extends Document {
  solicitud_id: mongoose.Types.ObjectId;
  emisor_id: mongoose.Types.ObjectId;
  receptor_id: mongoose.Types.ObjectId;
  contenido: string;
  fecha_envio: Date;
}

const MensajeSchema: Schema = new Schema({
  solicitud_id: { type: Schema.Types.ObjectId,
     ref: 'Solicitud', required: true },

  emisor_id: { type: Schema.Types.ObjectId, 
    ref: 'Usuario', 
    required: true },

  receptor_id: { type: Schema.Types.ObjectId, 
    ref: 'Usuario', 
    required: true },

  contenido: { type: String, 
    required: true },

  fecha_envio: { type: Date, 
    default: Date.now }
});

export default mongoose.model<IMensaje>('Mensaje', MensajeSchema);
