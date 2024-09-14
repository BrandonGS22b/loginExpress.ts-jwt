import mongoose from 'mongoose';

export class MongoDatabase {

  static async connect(): Promise<boolean> {
    const mongoUrl = 'mongodb+srv://brandon222b:i4XpuZK7HCbZ6I1N@cluster0.fn3zw.mongodb.net/?retryWrites=true&w=majority&tls=true&tlsInsecure=true';
   //nevo
    const dbName = 'mystore';

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
