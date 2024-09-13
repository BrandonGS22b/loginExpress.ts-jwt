"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Uuid = void 0;
const uuid_1 = require("uuid");
class Uuid {
}
exports.Uuid = Uuid;
Uuid.v4 = () => (0, uuid_1.v4)();
