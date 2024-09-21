import { Router } from 'express';
import {
  crearCategoriaProblema,
  obtenerCategoriasProblema,
  actualizarCategoriaProblema,
  eliminarCategoriaProblema
} from './categoriaProblema.controller';

const router = Router();

router.post('/', crearCategoriaProblema);
router.get('/', obtenerCategoriasProblema);
router.put('/:id', actualizarCategoriaProblema);
router.delete('/:id', eliminarCategoriaProblema);

export default router;
