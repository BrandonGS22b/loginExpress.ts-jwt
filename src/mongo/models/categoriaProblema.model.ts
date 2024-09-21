// src/models/categoriaProblema.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ICategoriaProblema extends Document {
  nombre: string;
}

const CategoriaProblemaSchema: Schema = new Schema({
  nombre: { type: String, required: true }
});

export default mongoose.model<ICategoriaProblema>('CategoriaProblema', CategoriaProblemaSchema);
