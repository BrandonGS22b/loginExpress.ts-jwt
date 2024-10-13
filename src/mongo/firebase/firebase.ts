import admin from 'firebase-admin';
import path from 'path';

// Carga tu archivo de claves
let serviceAccount;
try {
  serviceAccount = require(path.resolve(__dirname, '../../config/serviceAccountKey.json'));
} catch (error) {
  console.error('Error al cargar el archivo de claves de Firebase:', error);
  throw new Error('No se pudo cargar el archivo de claves de Firebase');
}

// Inicializa la aplicación de Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'proyecto-f7ec6.appspot.com' // Reemplaza con tu bucket de Firebase Storage
});

// Obtiene la referencia al bucket de almacenamiento
const bucket = admin.storage().bucket();

// Exporta el bucket para su uso en otros módulos
export default bucket;
