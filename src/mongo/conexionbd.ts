import mongoose from 'mongoose';

export class MongoDatabase {

  static async connect(): Promise<boolean> {
    const mongoUrl = 'mongodb+srv://brandong:a9AJ8RKP1CrGRjm5@brandong.sawk0.mongodb.net/?retryWrites=true&w=majority&appName=brandong';
    const dbName = 'brandong';

    // Habilitar logs detallados de Mongoose
    mongoose.set('debug', true);

    try {
      await mongoose.connect(mongoUrl, {
        dbName: dbName,
        tlsAllowInvalidCertificates: true, // Permite certificados no válidos
      });

      console.log('Conectado a MongoDB Atlas');
      return true;

    } catch (error) {
      console.error('Error de conexión a MongoDB:', error);
      throw error;
    }
  }
}
