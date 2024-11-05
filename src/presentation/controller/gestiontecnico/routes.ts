import { Router } from 'express';
import { crearAsignacion, obtenerAsignacionesPorTecnico, obtenerTodasAsignaciones } from './GestionTecnico';
import { upload } from './GestionTecnico'; // Asegúrate de que la ruta sea correcta

const router = Router();

// Ruta para crear una asignación con subida de imagen (usando el middleware de multer)
router.post('/asignaciones', upload.single('imagen'), crearAsignacion);

// Ruta para obtener asignaciones por ID de técnico
router.get('/asignaciones/tecnico/:tecnicoId', obtenerAsignacionesPorTecnico);

// Ruta para obtener todas las asignaciones
router.get('/asignaciones', obtenerTodasAsignaciones);

export default router;
