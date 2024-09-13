"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppRoutes = void 0;
const express_1 = require("express");
const routes_1 = require("./presentation/authLogin/routes");
//import { CategoryRoutes } from './categories/routes';
//import { ProductRoutes } from './products/routes';
//import { FileUploadRoutes } from './file-upload/routes';
//import { ImageRoutes } from './images/routes';
class AppRoutes {
    static get routes() {
        const router = (0, express_1.Router)();
        // Definir las rutas
        router.use('/api/auth', routes_1.Authroutes.routes);
        //router.use('/api/categories', CategoryRoutes.routes );
        //router.use('/api/products', ProductRoutes.routes );
        //router.use('/api/upload', FileUploadRoutes.routes );
        //router.use('/api/images', ImageRoutes.routes );
        //router.use('/api/routes', FileRoutes.r
        return router;
    }
}
exports.AppRoutes = AppRoutes;
