import mongoose from 'mongoose';

export class MongoDatabase {

  static async connect(): Promise<boolean> {
    const mongoUrl = 'mongodb+srv://brandong:a9AJ8RKP1CrGRjm5@brandong.sawk0.mongodb.net/?retryWrites=true&w=majority&appName=brandong';
   //nevo
    const dbName = 'brandong';

    try {
      await mongoose.connect(mongoUrl, {
        dbName: dbName,
        // Usar configuración mínima para probar la conexión
      });

      console.log('Conectado a MongoDB Atlas');
      return true;

    } catch (error) {
      console.error('Error de conexión a MongoDB:', error);
      throw error;
    }
  }
}
