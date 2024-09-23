// src/routes/solicitud.routes.ts
import { Router } from 'express';
import { crearSolicitud } from './solicitud.controller';

const router: Router = Router();

router.post('/create', crearSolicitud);
// Rutas adicionales (GET, PUT, DELETE)

export default router;
