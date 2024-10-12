import path from 'path';
import express, { Router } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { Server as HttpServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import multer from 'multer';

interface Options {
  port: number;
  routes: Router;
}

export class Server {
  public readonly app = express();
  private serverListener?: any;
  private readonly port: number;
  private readonly routes: Router;
  private io?: SocketServer;

  constructor(options: Options) {
    const { port, routes } = options;
    this.port = port;
    this.routes = routes;
  }

  async start() {
    // Middlewares
    this.app.use(cors({
      origin: ['http://localhost:3000', 'http://192.168.1.5:3000'],
      credentials: true,
    }));

    this.app.use(cookieParser());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.static(path.join(__dirname, '../../uploads')));

    this.app.use(this.routes);

    this.app.get('/uploads/:filename', (req, res) => {
      const { filename } = req.params;
      const filePath = path.join(__dirname, '../../uploads', filename);
      res.sendFile(filePath, (err) => {
        if (err) {
          console.error('Error al servir el archivo:', err);
          res.status(404).send('Archivo no encontrado');
        }
      });
    });




    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../uploads')); // Carpeta de destino
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname); // Nombre único
      }
    });
    
    const upload = multer({ storage });
    
    // Ruta para subir archivos
    this.app.post('/upload', upload.single('image'), (req, res) => {
      if (!req.file) {
        return res.status(400).send('No se subió ningún archivo');
      }
      res.status(200).send({ filename: req.file.filename });
    });



    // Crear el servidor HTTP
    const httpServer = new HttpServer(this.app);
    // Inicializar Socket.IO
    this.io = new SocketServer(httpServer);

    // Manejar conexiones de WebSocket
    this.io.on('connection', (socket) => {
      console.log('Nuevo cliente conectado');
      socket.on('disconnect', () => {
        console.log('Cliente desconectado');
      });
    });

    // Iniciar servidor
    this.serverListener = httpServer.listen(this.port, () => {
      console.log(`Servidor corriendo en el puerto: ${this.port}`);
    });
  };

  public close() {
    this.serverListener?.close();
  }
}