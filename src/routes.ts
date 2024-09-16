import { Router } from 'express';

import { Authroutes } from './presentation/controller/authLogin/routes';
//import { CategoryRoutes } from './categories/routes';
//import { ProductRoutes } from './products/routes';
//import { FileUploadRoutes } from './file-upload/routes';
//import { ImageRoutes } from './images/routes';






export class AppRoutes {


  static get routes(): Router {

    const router = Router();
    
    // Definir las rutas
    router.use('/api/auth', Authroutes.routes );
   //continuacion 

    //router.use('/api/categories', CategoryRoutes.routes );
    //router.use('/api/products', ProductRoutes.routes );
    //router.use('/api/upload', FileUploadRoutes.routes );
    //router.use('/api/images', ImageRoutes.routes );
    //router.use('/api/routes', FileRoutes.r
    


    return router;
  }


}

