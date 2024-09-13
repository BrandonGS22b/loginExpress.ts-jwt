"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const login_user_dto_1 = require("../../auth/login-user.dto");
const register_user_dto_1 = require("../../auth/register-user.dto");
const config_1 = require("../../config");
class AuthController {
    // DI
    constructor(authService) {
        this.authService = authService;
        this.handleError = (error, res) => {
            // Manejo genérico de errores
            console.error(error); // Log del error en el servidor
            return res.status(500).json({ error: 'Internal server error' });
        };
        this.registerUser = (req, res) => {
            const [error, registerDto] = register_user_dto_1.RegisterUserDto.create(req.body);
            if (error)
                return res.status(400).json({ error });
            this.authService.registerUser(registerDto)
                .then((user) => res.json(user))
                .catch(error => this.handleError(error, res));
        };
        this.loginUser = (req, res) => {
            const [error, loginUserDto] = login_user_dto_1.LoginUserDto.create(req.body);
            if (error)
                return res.status(400).json({ error });
            this.authService.loginUser(loginUserDto)
                .then((user) => res.json(user))
                .catch(error => this.handleError(error, res));
        };
        this.validateEmail = (req, res) => {
            const { token } = req.params;
            this.authService.validateEmail(token)
                .then(() => res.json('Email was validated properly'))
                .catch(error => this.handleError(error, res));
        };
        // Método para obtener todos los usuarios con validación de token
        this.getAllUsers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            // Extraer el token del encabezado Authorization
            const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
            if (!token) {
                return res.status(401).json({ error: 'Token is missing' });
            }
            try {
                // Valida el token en el controlador
                const payload = config_1.JwtAdapter.validateToken(token);
                if (!payload) {
                    return res.status(401).json({ error: 'Invalid token' });
                }
                // Llamar al servicio para obtener todos los usuarios
                const users = yield this.authService.getAllUsers();
                // Formatear los usuarios si es necesario
                const formattedUsers = users.map(user => {
                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        emailValidated: user.emailValidated,
                        role: user.role,
                        img: user.img || null // Puedes añadir otros campos o transformarlos
                    };
                });
                // Incluir el token en la respuesta
                return res.status(200).json({
                    token, // Devolver el token que se usó en la solicitud
                    users: formattedUsers // Los usuarios formateados
                });
            }
            catch (error) {
                console.error('Error fetching users:', error);
                if (error instanceof Error) {
                    return res.status(500).json({ error: error.message });
                }
                else {
                    return res.status(500).json({ error: 'Unknown error occurred' });
                }
            }
        });
    }
}
exports.AuthController = AuthController;
