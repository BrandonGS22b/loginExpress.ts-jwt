"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUserDto = void 0;
const config_1 = require("../config/");
class LoginUserDto {
    constructor(email, password) {
        this.email = email;
        this.password = password;
    }
    static create(object) {
        const { email, password } = object;
        if (!email)
            return ['Missing email'];
        if (!config_1.regularExps.email.test(email))
            return ['Email is not valid'];
        if (!password)
            return ['Missing password'];
        if (password.length < 6)
            return ['Password too short'];
        return [undefined, new LoginUserDto(email, password)];
    }
}
exports.LoginUserDto = LoginUserDto;
