import { Router } from 'express';
import {
  crearSolicitud,
  obtenerSolicitudes,
  actualizarSolicitud
} from './GestionMantenimiento';

const router: Router = Router();

// Ruta para crear un nuevo mensaje
router.post('/create', crearSolicitud);

// Ruta para obtener todos los mensajes
router.get('/get', obtenerSolicitudes);

// Ruta para eliminar un mensaje por ID
router.put('/update/:id', actualizarSolicitud);

export default router;
