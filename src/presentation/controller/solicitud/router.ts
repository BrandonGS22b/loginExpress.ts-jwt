// src/routes/solicitud.routes.ts
import { Router } from 'express';
import { 
  crearSolicitud, 
  obtenerSolicitudes, 
  obtenerSolicitudPorId, 
  actualizarSolicitud, 
  eliminarSolicitud 
} from './solicitud.controller';

const router: Router = Router();

// Ruta para crear una nueva solicitud
router.post('/create', crearSolicitud);

// Ruta para obtener todas las solicitudes
router.get('/', obtenerSolicitudes);

// Ruta para obtener una solicitud por ID
router.get('/:id', obtenerSolicitudPorId);

// Ruta para actualizar una solicitud por ID
router.put('/:id', actualizarSolicitud);

// Ruta para eliminar una solicitud por ID
router.delete('/:id', eliminarSolicitud);

export default router;
