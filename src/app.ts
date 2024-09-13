import { MongoDatabase } from './mongo/conexionbd';
import { AppRoutes } from './routes';
import { Server } from './presentation/server';

(async () => {
  await main();
})();

async function main() {
  // Conexión directa a MongoDB
  await MongoDatabase.connect();

  // Configuración del servidor
  const server = new Server({
    port: 3000, // Puerto definido directamente
    routes: AppRoutes.routes,
  });

  server.start();
}
