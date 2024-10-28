import { Router } from 'express';
import {
  crearMantenimiento, // Cambiado a crearMantenimiento
  obtenerMantenimientos, // Cambiado a obtenerMantenimientos
  actualizarMantenimiento // Cambiado a actualizarMantenimiento
} from './GestionMantenimiento'; // Asegúrate de que la ruta sea correcta

const router: Router = Router();

// Ruta para crear un nuevo mantenimiento
router.post('/create', crearMantenimiento); // Cambiado a crearMantenimiento

// Ruta para obtener todos los mantenimientos
router.get('/get', obtenerMantenimientos); // Cambiado a obtenerMantenimientos

// Ruta para actualizar un mantenimiento por ID
router.put('/update/:id', actualizarMantenimiento); // Cambiado a actualizarMantenimiento

export default router;
