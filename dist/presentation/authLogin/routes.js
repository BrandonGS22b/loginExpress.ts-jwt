"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authroutes = void 0;
const config_1 = require("./../../config");
const express_1 = require("express");
const controller_1 = require("./controller");
const services_1 = require("../services");
class Authroutes {
    static get routes() {
        const router = (0, express_1.Router)();
        const emailService = new services_1.EmailService(config_1.envs.MAILER_SERVICE, config_1.envs.MAILER_EMAIL, config_1.envs.MAILER_SECRET_KEY);
        const authService = new services_1.AuthService(emailService);
        const controller = new controller_1.AuthController(authService);
        const getUsers = new controller_1.AuthController(authService);
        // Definir las rutas
        router.post('/login', controller.loginUser);
        router.post('/register', controller.registerUser);
        router.get('/users', getUsers.getAllUsers); // Añadir esta ruta al final para que funcione con la validación JWT.
        router.get('/validate-email/:token', controller.validateEmail);
        return router;
    }
}
exports.Authroutes = Authroutes;
