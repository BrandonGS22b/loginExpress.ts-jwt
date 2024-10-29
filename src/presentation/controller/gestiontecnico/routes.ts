import { Router } from 'express';
import { crearAsignacion, obtenerAsignacionesPorTecnico,obtenerTodasAsignaciones } from './GestionTecnico';

const router = Router();

router.post('/asignar', crearAsignacion);
router.get('/tecnico/:tecnicoId', obtenerAsignacionesPorTecnico);
router.get('/asignaciones', obtenerTodasAsignaciones);

export default router;