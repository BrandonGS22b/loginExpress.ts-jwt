import { ProcessModel } from '../../mongo/models/process.model';
import { ProcessDto } from '../../auth/process.dto'; // Asegúrate de crear este DTO

 class ProcessService {

  public async createProcess(processDto: ProcessDto) {
    try {
      const process = new ProcessModel(processDto);
      await process.save();
      return process;
    } catch (error) {
      throw new Error(`Error creating process: `);
    }
  }

  public async updateProcess(processId: string, updates: Partial<ProcessDto>) {
    try {
      const process = await ProcessModel.findByIdAndUpdate(processId, updates, { new: true });
      if (!process) throw new Error('Process not found');
      return process;
    } catch (error) {
      throw new Error(`Error updating process: `);
    }
  }

  public async getProcessByReportId(reportId: string) {
    try {
      const processes = await ProcessModel.find({ reportId });
      return processes;
    } catch (error) {
      throw new Error(`Error fetching processes`);
    }
  }
}

export default  ProcessService;