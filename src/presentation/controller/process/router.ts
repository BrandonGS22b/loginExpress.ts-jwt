import { Router } from 'express';
import ProcessController from './process.controller';
import ProcessService from '../../services/process.service';

export class ProcessRoutes {
  static get routes(): Router {
    const router = Router();
    const processService = new ProcessService();
    const controller = new ProcessController(processService);

    // Crear un nuevo proceso
    router.post('/', controller.createProcess);

    // Actualizar un proceso existente
    router.put('/:processId', controller.updateProcess);

    // Obtener procesos por ID de reporte
    router.get('/report/:reportId', controller.getProcessByReportId);

    return router;
  }
}
