import mongoose, { Document, Schema } from 'mongoose';

export interface IImage extends Document {
  filename: string;
  path: string;
  mimetype: string;
  size: number;
}

const ImageSchema: Schema = new Schema({
  filename: { type: String, required: true },
  path: { type: String, required: true },
  mimetype: { type: String, required: true },
  size: { type: Number, required: true },
});

export const ImageModel = mongoose.model<IImage>('Image', ImageSchema);
