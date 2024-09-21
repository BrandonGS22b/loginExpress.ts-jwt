import { Router } from 'express';
import {
  crearEvaluacion,
  obtenerEvaluaciones,
  eliminarEvaluacion
} from './evaluacion.controller';

const router = Router();

router.post('/', crearEvaluacion);
router.get('/', obtenerEvaluaciones);
router.delete('/:id', eliminarEvaluacion);

export default router;
