import mongoose from 'mongoose';

export class MongoDatabase {

  static async connect(): Promise<boolean> {
    const mongoUrl = 'mongodb+srv://brandon222b:i4XpuZK7HCbZ6I1N@cluster0.fn3zw.mongodb.net/mystore';
    const dbName = 'mystore';

    try {
      await mongoose.connect(mongoUrl, {
        dbName: dbName,
        tls: true, // Habilita TLS explícitamente
        tlsAllowInvalidCertificates: false, // Configura según tus necesidades
        tlsAllowInvalidHostnames: false, // Configura según tus necesidades
      });

      console.log('Conectado a MongoDB Atlas');
      return true;

    } catch (error) {
      console.error('Error de conexión a MongoDB:', error);
      throw error;
    }
  }
}
