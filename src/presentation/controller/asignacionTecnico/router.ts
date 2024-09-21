import { Router } from 'express';
import {
  crearAsignacionTecnico,
  obtenerAsignacionesTecnico,
  eliminarAsignacionTecnico
} from './asignacionTecnico.controller';

const router = Router();

router.post('/', crearAsignacionTecnico);
router.get('/', obtenerAsignacionesTecnico);
router.delete('/:id', eliminarAsignacionTecnico);

export default router;
