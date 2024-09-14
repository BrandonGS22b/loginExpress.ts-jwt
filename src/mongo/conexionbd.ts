import mongoose from 'mongoose';

export class MongoDatabase {

  static async connect(): Promise<boolean> {
    // URL de conexión a MongoDB Atlas
    const mongoUrl = 'mongodb+srv://brandong:a9AJ8RKP1CrGRjm5@brandong.sawk0.mongodb.net/?retryWrites=true&w=majority';
    const dbName = 'brandong';

    // Habilitar logs detallados de Mongoose para depuración
    mongoose.set('debug', true);

    try {
      await mongoose.connect(mongoUrl, {
        dbName: dbName,  // Nombre de la base de datos
        tlsAllowInvalidCertificates: true, // Permitir certificados no válidos (considerar eliminar en producción)
      });

      console.log('Conectado a MongoDB Atlas');
      return true;

    } catch (error) {
      console.error('Error de conexión a MongoDB:', error);
      throw error;
    }
  }
}
