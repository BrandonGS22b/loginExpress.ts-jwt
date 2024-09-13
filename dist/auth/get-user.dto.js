"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserDto = void 0;
const config_1 = require("../config/");
class GetUserDto {
    constructor(id, email) {
        this.id = id;
        this.email = email;
    }
    static create(object) {
        const { id, email } = object;
        // Si hay un ID, valida que no esté vacío
        if (id && typeof id !== 'string')
            return ['Invalid id'];
        // Si hay un email, valida que sea correcto
        if (email && !config_1.regularExps.email.test(email))
            return ['Email is not valid'];
        // Si no se proporciona ni ID ni email
        if (!id && !email)
            return ['Missing id or email'];
        // Si pasa las validaciones, crea la instancia del DTO
        return [undefined, new GetUserDto(id, email)];
    }
}
exports.GetUserDto = GetUserDto;
