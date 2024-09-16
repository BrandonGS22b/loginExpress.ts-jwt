import { Request, Response } from 'express';
import ProcessService  from '../../services/process.service';

class ProcessController {
  constructor(
    private readonly processService: ProcessService,
  ) {}

  // Crear un nuevo proceso
  public createProcess = async (req: Request, res: Response) => {
    const processDto = req.body;
    const process = await this.processService.createProcess(processDto);
    return res.status(201).json(process);
  };

  // Actualizar un proceso existente
  public updateProcess = async (req: Request, res: Response) => {
    const { processId } = req.params;
    const updates = req.body;
    const process = await this.processService.updateProcess(processId, updates);
    return res.status(200).json(process);
  };

  // Obtener procesos por ID de reporte
  public getProcessByReportId = async (req: Request, res: Response) => {
    const { reportId } = req.params;
    const processes = await this.processService.getProcessByReportId(reportId);
    return res.status(200).json(processes);
  };
}

export default ProcessController;
