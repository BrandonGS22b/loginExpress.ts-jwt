"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envs = void 0;
require("dotenv/config");
const env_var_1 = require("env-var");
exports.envs = {
    PORT: (0, env_var_1.get)('PORT').required().asPortNumber(),
    // MONGO_URL: get('MONGO_URL').required().asString(),
    //MONGO_DB_NAME: get('MONGO_DB_NAME').required().asString(),
    JWT_SEED: (0, env_var_1.get)('JWT_SEED').required().asString(),
    MAILER_SERVICE: (0, env_var_1.get)('MAILER_SERVICE').required().asString(),
    MAILER_EMAIL: (0, env_var_1.get)('MAILER_EMAIL').required().asString(),
    MAILER_SECRET_KEY: (0, env_var_1.get)('MAILER_SECRET_KEY').required().asString(),
    WEBSERVICE_URL: (0, env_var_1.get)('WEBSERVICE_URL').required().asString(),
};
