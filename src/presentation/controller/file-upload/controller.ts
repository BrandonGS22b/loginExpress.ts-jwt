import { Response, Request } from 'express';
import { FileUploadService } from '../../services/file-upload.service';
import { UploadedFile } from 'express-fileupload';
import 'express-async-errors';  // Importar express-async-errors para el manejo automático de errores

export class FileUploadController {

  // Inyección de dependencias (DI)
  constructor(
    private readonly fileUploadService: FileUploadService,
  ) { }

  // Método para manejar la carga de un archivo
  uploadFile = async (req: Request, res: Response) => {
    const type = req.params.type;
    const file = req.body.files.at(0) as UploadedFile;

    // Intentar cargar el archivo con el servicio
    const uploaded = await this.fileUploadService.uploadSingle(file, `uploads/${type}`);
    return res.json(uploaded);
  };

  // Método para manejar la carga de múltiples archivos
  uploadMultipleFiles = async (req: Request, res: Response) => {
    const type = req.params.type;
    const files = req.body.files as UploadedFile[];

    // Intentar cargar múltiples archivos con el servicio
    const uploaded = await this.fileUploadService.uploadMultiple(files, `uploads/${type}`);
    return res.json(uploaded);
  };
}
