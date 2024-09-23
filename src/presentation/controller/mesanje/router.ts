import { Router } from 'express';
import {
  crearMensaje,
  obtenerMensajes,
  eliminarMensaje
} from './mensaje.controller';

const router = Router();

router.post('/create', crearMensaje);
router.get('/', obtenerMensajes);
router.delete('/:id', eliminarMensaje);

export default router;
