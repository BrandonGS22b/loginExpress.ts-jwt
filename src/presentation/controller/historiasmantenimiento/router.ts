import { Router } from 'express';
import {
  crearHistorialMantenimiento,
  obtenerHistorialesMantenimiento,
  eliminarHistorialMantenimiento
} from './historialMantenimiento.controller';

const router = Router();

router.post('/', crearHistorialMantenimiento);
router.get('/', obtenerHistorialesMantenimiento);
router.delete('/:id', eliminarHistorialMantenimiento);

export default router;
