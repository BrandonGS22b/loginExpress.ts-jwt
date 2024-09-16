import { Router } from 'express';
import ReportController from './reportcontroller';
import { ReportService } from '../../services/report.service';

export class ReportRoutes {
  static get routes() {
    const router = Router();
    const reportService = new ReportService();
    const controller = new ReportController(reportService);

    // Crear un nuevo reporte
    router.post('/', controller.createReport);

    // Actualizar un reporte existente
    router.put('/:reportId', controller.updateReport);

    // Obtener un reporte por ID
    router.get('/:reportId', controller.getReportById);

    return router;
  }
}
