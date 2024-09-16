import { ReportModel } from '../../mongo/models/report.model';
import { ReportDto } from '../../auth/report.dto'; // Asegúrate de crear este DTO

export class ReportService {

  public async createReport(reportDto: ReportDto) {
    try {
      const report = new ReportModel(reportDto);
      await report.save();
      return report;
    } catch (error) {
      throw new Error(`Error creating report`);
    }
  }

  public async updateReport(reportId: string, updates: Partial<ReportDto>) {
    try {
      const report = await ReportModel.findByIdAndUpdate(reportId, updates, { new: true });
      if (!report) throw new Error('Report not found');
      return report;
    } catch (error) {
      throw new Error(`Error updating report`);
    }
  }

  public async getReportById(reportId: string) {
    try {
      const report = await ReportModel.findById(reportId);
      if (!report) throw new Error('Report not found');
      return report;
    } catch (error) {
      throw new Error(`Error fetching report`);
    }
  }
}