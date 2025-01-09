import { Router } from 'express';
import { 
  crearSolicitud, 
  obtenerSolicitudes, 
  obtenerSolicitudPorId, 
  actualizarSolicitud, 
  eliminarSolicitud, 
  obtenerSolicitudesPorUsuarioId,
  upload, // Importamos el middleware de multer
  exportarSolicitudesExcel // Importamos la función para exportar a Excel
  
} from './solicitud.controller';

const router: Router = Router();
router.get('/solicitudes/exportar', exportarSolicitudesExcel);
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

router.get('/getall/:id', obtenerSolicitudesPorUsuarioId);


export default router;
