import { Request, Response } from 'express';
import { ReportService } from '../../services/report.service';

class ReportController {
  constructor(
    private readonly reportService: ReportService,
  ) {}

  // Crear un nuevo reporte
  public createReport = async (req: Request, res: Response) => {
    const reportDto = req.body;
    const report = await this.reportService.createReport(reportDto);
    return res.status(201).json(report);
  };

  // Actualizar un reporte
  public updateReport = async (req: Request, res: Response) => {
    const { reportId } = req.params;
    const updates = req.body;
    const report = await this.reportService.updateReport(reportId, updates);
    return res.status(200).json(report);
  };

  // Obtener un reporte por ID
  public getReportById = async (req: Request, res: Response) => {
    const { reportId } = req.params;
    const report = await this.reportService.getReportById(reportId);
    return res.status(200).json(report);
  };
}

export default ReportController;
