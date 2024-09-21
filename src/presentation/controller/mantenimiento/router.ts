import { Router } from 'express';
import {
  crearMantenimiento,
  obtenerMantenimientos,
  actualizarMantenimiento,
  eliminarMantenimiento
} from './mantenimiento.controller';

const router = Router();

router.post('/', crearMantenimiento);
router.get('/', obtenerMantenimientos);
router.put('/:id', actualizarMantenimiento);
router.delete('/:id', eliminarMantenimiento);

export default router;
