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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const config_1 = require("../../config");
const user_model_1 = require("../../mongo/models/user.model");
class AuthService {
    // DI
    constructor(
    // DI - Email Service
    emailService) {
        this.emailService = emailService;
        this.sendEmailValidationLink = (email) => __awaiter(this, void 0, void 0, function* () {
            const token = yield config_1.JwtAdapter.generateToken({ email });
            if (!token)
                throw new Error('Error generating token');
            const link = `${config_1.envs.WEBSERVICE_URL}/auth/validate-email/${token}`;
            const html = `
      <h1>Validate your email</h1>
      <p>Click on the following link to validate your email</p>
      <a href="${link}">Validate your email: ${email}</a>
    `;
            const options = {
                to: email,
                subject: 'Validate your email',
                htmlBody: html,
            };
            const isSent = yield this.emailService.sendEmail(options);
            if (!isSent)
                throw new Error('Error sending email');
            return true;
        });
        this.validateEmail = (token) => __awaiter(this, void 0, void 0, function* () {
            const payload = yield config_1.JwtAdapter.validateToken(token);
            if (!payload)
                throw new Error('Invalid token');
            const { email } = payload;
            if (!email)
                throw new Error('Email not in token');
            const user = yield user_model_1.UserModel.findOne({ email });
            if (!user)
                throw new Error('Email does not exist');
            user.emailValidated = true;
            yield user.save();
            return true;
        });
    }
    registerUser(registerUserDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const existUser = yield user_model_1.UserModel.findOne({ email: registerUserDto.email });
            if (existUser)
                throw new Error('Email already exists');
            try {
                const user = new user_model_1.UserModel(registerUserDto);
                // Encriptar la contraseña
                user.password = config_1.bcryptAdapter.hash(registerUserDto.password);
                yield user.save();
                // Email de confirmación
                yield this.sendEmailValidationLink(user.email);
                const _a = user.toObject(), { password } = _a, userEntity = __rest(_a, ["password"]); // No usar UserEntity
                const token = yield config_1.JwtAdapter.generateToken({ id: user.id });
                if (!token)
                    throw new Error('Error while creating JWT');
                return {
                    user: userEntity,
                    token: token,
                };
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Internal server error: ${error.message}`);
                }
                else {
                    throw new Error('An unknown error occurred');
                }
            }
        });
    }
    loginUser(loginUserDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.UserModel.findOne({ email: loginUserDto.email });
            if (!user)
                throw new Error('Email does not exist');
            const isMatching = config_1.bcryptAdapter.compare(loginUserDto.password, user.password);
            if (!isMatching)
                throw new Error('Password is not valid');
            const _a = user.toObject(), { password } = _a, userEntity = __rest(_a, ["password"]); // No usar UserEntity
            const token = yield config_1.JwtAdapter.generateToken({ id: user.id });
            if (!token)
                throw new Error('Error while creating JWT');
            return {
                user: userEntity,
                token: token,
            };
        });
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield user_model_1.UserModel.find(); // Busca todos los usuarios
                return users;
            }
            catch (error) {
                throw new Error('Error fetching users');
            }
        });
    }
}
exports.AuthService = AuthService;
