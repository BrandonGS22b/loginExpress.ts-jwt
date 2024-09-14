import mongoose from 'mongoose';

export class MongoDatabase {

  static async connect(): Promise<boolean> {
    const mongoUrl = 'mongodb+srv://UTS:uts2024@uts.ccyqodk.mongodb.net/Dev2024E191?retryWrites=true&w=majority&appName=UTS/brandong';
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
