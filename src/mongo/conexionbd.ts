import mongoose from 'mongoose';

export class MongoDatabase {

  static async connect(): Promise<boolean> {
    // URL de conexión simplificada
    const mongoUrl = 'mongodb+srv://brandong:a9AJ8RKP1CrGRjm5@brandong.sawk0.mongodb.net/brandong?retryWrites=true&w=majority&appName=brandong';
//
    // Habilitar logs detallados de Mongoose para depuración
    mongoose.set('debug', true);

    try {
      // Conectar a MongoDB Atlas sin opciones adicionales
      await mongoose.connect(mongoUrl);

      console.log('Conectado a MongoDB Atlas');
      return true;

    } catch (error) {
      console.error('Error de conexión a MongoDB:', error);
      throw error;
    }
  }
}
