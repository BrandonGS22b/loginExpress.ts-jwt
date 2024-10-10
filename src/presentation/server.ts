import path from 'path';
import express, { Router } from 'express';
import cors from 'cors'; // Importa CORS
import cookieParser from 'cookie-parser';


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
    this.app.use(cors({
      origin: ['http://localhost:3000', 'http://192.168.1.5:3000'],
      credentials: true, // Habilitar si estás usando cookies o credenciales
    }));

    this.app.use(cookieParser());

    // Configuración para parsear JSON y formularios
    this.app.use(express.json()); // raw
    this.app.use(express.urlencoded({ extended: true })); // x-www-form-urlencoded

    //* Carpeta pública para archivos estáticos
    this.app.use(express.static(path.join(__dirname, `../../../${this.publicPath}`))); // Servir archivos de la carpeta 'public'
    this.app.use(express.static(path.join(__dirname, '../../uploads'))); // Servir archivos de la carpeta 'uploads'

    //* Definir rutas
    this.app.use(this.routes);

    //* SPA
    this.app.get('*', (req, res) => {
      const indexPath = path.join(__dirname, `../../../${this.publicPath}/index.html`);
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
