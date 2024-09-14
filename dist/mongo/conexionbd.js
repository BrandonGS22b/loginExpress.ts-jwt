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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
class MongoDatabase {
    static connect() {
        return __awaiter(this, void 0, void 0, function* () {
            const mongoUrl = 'mongodb+srv://brandong:a9AJ8RKP1CrGRjm5@brandong.sawk0.mongodb.net/?retryWrites=true&w=majority&appName=brandong';
            const dbName = 'brandong';
            // Habilitar logs detallados de Mongoose
            mongoose_1.default.set('debug', true);
            try {
                yield mongoose_1.default.connect(mongoUrl, {
                    dbName: dbName,
                    tlsAllowInvalidCertificates: true, // Permite certificados no válidos
                });
                console.log('Conectado a MongoDB Atlas');
                return true;
            }
            catch (error) {
                console.error('Error de conexión a MongoDB:', error);
                throw error;
            }
        });
    }
}
exports.MongoDatabase = MongoDatabase;
