import { Router } from 'express';
import { crearAsignacion, obtenerAsignacionesPorTecnico } from './GestionTecnico';

const router = Router();

router.post('/asignar', crearAsignacion);
router.get('/tecnico/:tecnicoId', obtenerAsignacionesPorTecnico);

export default router;