import { Router } from 'express';
import { 
  crearSolicitud, 
  obtenerSolicitudes, 
  obtenerSolicitudPorId, 
  actualizarSolicitud, 
  eliminarSolicitud, 
  upload // Importamos el middleware de multer
} from './solicitud.controller';

const router: Router = Router();

// Ruta para crear una nueva solicitud (con imagen)
router.post('/create', upload.single('imagen'), crearSolicitud);

// Ruta para obtener todas las solicitudes
router.get('/getall', obtenerSolicitudes);

// Ruta para obtener una solicitud por ID
router.get('/get/:id', obtenerSolicitudPorId);

// Ruta para actualizar una solicitud por ID (con opción de subir una nueva imagen)
router.put('/update/:id', upload.single('imagen'), actualizarSolicitud);

// Ruta para eliminar una solicitud por ID
router.delete('/delete/:id', eliminarSolicitud);
//exportacion a otros componentes
export default router;
