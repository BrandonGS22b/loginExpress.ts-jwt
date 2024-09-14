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
            const mongoUrl = 'mongodb+srv://UTS:uts2024@uts.ccyqodk.mongodb.net/Dev2024E191?retryWrites=true&w=majority&appName=UTS/Usuario';
            const dbName = 'Usuario';
            try {
                yield mongoose_1.default.connect(mongoUrl, {
                    dbName: dbName,
                    // Usar configuración mínima para probar la conexión
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
