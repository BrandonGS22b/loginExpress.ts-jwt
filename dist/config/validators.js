"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validators = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
class Validators {
    static isMongoID(id) {
        return mongoose_1.default.isValidObjectId(id);
    }
}
exports.Validators = Validators;
