import path from 'path';
import express, { Router } from 'express';
import fileUpload from 'express-fileupload';
import cors from 'cors'; // Importa CORS

interface Options {
  port: number;
  routes: Router;
  public_path?: string;
}

export class Server {
  public readonly app = express();
  private serverListener?: any;
  private readonly port: number;
  private readonly publicPath: string;
  private readonly routes: Router;

  constructor(options: Options) {
    const { port, routes, public_path = 'public' } = options;
    this.port = port;
    this.publicPath = public_path;
    this.routes = routes;
  }

  async start() {
    //* Middlewares

    // Configurar CORS antes de definir rutas
    this.app.use(cors());

    // Configuración para parsear JSON y formularios
    this.app.use(express.json()); // raw
    this.app.use(express.urlencoded({ extended: true })); // x-www-form-urlencoded
    
    // Configuración para subir archivos
    this.app.use(
      fileUpload({
        limits: { fileSize: 50 * 1024 * 1024 }, // Limite de 50 MB
      })
    );

    //* Carpeta pública
    this.app.use(express.static(this.publicPath));

    //* Definir rutas
    this.app.use(this.routes);

    //* SPA
    this.app.get('*', (req, res) => {
      const indexPath = path.join(__dirname + `../../../${this.publicPath}/index.html`);
      res.sendFile(indexPath);
    });

    //* Iniciar servidor
    this.serverListener = this.app.listen(this.port, () => {
      console.log(`Servidor corriendo en el puerto: ${this.port}`);
    });
  }

  public close() {
    this.serverListener?.close();
  }
}
