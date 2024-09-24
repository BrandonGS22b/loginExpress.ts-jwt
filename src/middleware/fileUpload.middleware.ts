import multer from 'multer';
import path from 'path';

// Configuración de almacenamiento para Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Carpeta donde se almacenarán las imágenes que va ser en la raiz si quiero que sea 
  },                        // en el src seria entonces ../uploads/
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nombre único para cada archivo
  },
});

// Filtro para aceptar solo imágenes
const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type, only JPEG and PNG is allowed!'), false);
  }
};

// Middleware Multer
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // Limitar a 5MB
  },
  fileFilter: fileFilter,
});
