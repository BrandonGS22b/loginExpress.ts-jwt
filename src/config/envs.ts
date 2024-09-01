import 'dotenv/config'; // Asegúrate de haber instalado dotenv y de importar esto al principio de tu archivo principal

import { get } from 'env-var'; // Si estás usando env-var para manejar las variables de entorno

export const envs = {
  PORT: get('PORT').required().asPortNumber(),
  MONGO_URL: get('MONGO_URL').required().asString(),
  MONGO_DB_NAME: get('MONGO_DB_NAME').required().asString(),
  JWT_SEED: get('JWT_SEED').required().asString(),
  SEND_EMAIL: get('SEND_EMAIL').default('false').asBool(),
  MAILER_SERVICE: get('MAILER_SERVICE').required().asString(),
  MAILER_EMAIL: get('MAILER_EMAIL').required().asString(),
  MAILER_SECRET_KEY: get('MAILER_SECRET_KEY').required().asString(),
  WEBSERVICE_URL: get('WEBSERVICE_URL').required().asString(),
};

// Ejemplo de uso
const port = envs.PORT;
console.log(`Server running on port ${port}`);