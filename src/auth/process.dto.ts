export class ProcessDto {
    reportId!: string;
    assignedTo?: string; // Opcional
    currentStep!: string;
    notes?: string; // Opcional
  
    constructor(reportId: string, currentStep: string, assignedTo?: string, notes?: string) {
      this.reportId = reportId;
      this.currentStep = currentStep;
      this.assignedTo = assignedTo;
      this.notes = notes;
    }
  
    static create(data: Partial<ProcessDto>): [Error | null, ProcessDto | null] {
      const { reportId, currentStep, assignedTo, notes } = data;
      if (!reportId || !currentStep) {
        return [new Error('Missing required fields'), null];
      }
      return [null, new ProcessDto(reportId, currentStep, assignedTo, notes)];
    }
  }
  