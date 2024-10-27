import { Router } from 'express';

import Authroutes from './presentation/controller/authLogin/routes'; // Apunta al router del controller

// Importar las rutas faltantes
import categoriaProblemaRoutes from './presentation/controller/categoriaproblema/router';
import mantenimientoRoutes from './presentation/controller/mantenimiento/router';
import historialMantenimientoRoutes from './presentation/controller/historiasmantenimiento/router';
import asignacionTecnicoRoutes from './presentation/controller/asignacionTecnico/router';
import GestionMantenimiento from './presentation/controller/GestionMantenimiento/router';
import evaluacionRoutes from './presentation/controller/evaluacion/router';
import solicitud from './presentation/controller/solicitud/router';
import GestionTecnicosRoutes from './presentation/controller/gestiontecnico/routes';




export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    // Definir las rutas
    router.use('/api/auth', Authroutes.routes);
    router.use('/api/GestionTecnico',GestionTecnicosRoutes );
    // Rutas para cada uno de los modelos
    router.use('/api/solicitud', solicitud);
    router.use('/api/categoriaProblema', categoriaProblemaRoutes);
    router.use('/api/mantenimiento', mantenimientoRoutes);
    router.use('/api/historialMantenimiento', historialMantenimientoRoutes);
    router.use('/api/asignacionTecnico', asignacionTecnicoRoutes);
    router.use('/api/GestionMantenimiento', GestionMantenimiento);
    router.use('/api/evaluacion', evaluacionRoutes);
    

  

    return router;
  }
}
