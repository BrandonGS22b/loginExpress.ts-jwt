export class ReportDto {
    userId!: string;
    description!: string;
    status?: string = 'PENDING'; // Valor por defecto
    imageUrl?: string; // Opcional
    location!: { lat: number, lng: number };
  
    constructor(userId: string, description: string, location: { lat: number, lng: number }, status?: string, imageUrl?: string) {
      this.userId = userId;
      this.description = description;
      this.location = location;
      this.status = status;
      this.imageUrl = imageUrl;
    }
  
    static create(data: Partial<ReportDto>): [Error | null, ReportDto | null] {
      const { userId, description, location, status, imageUrl } = data;
      if (!userId || !description || !location) {
        return [new Error('Missing required fields'), null];
      }
      return [null, new ReportDto(userId, description, location, status, imageUrl)];
    }
  }
  