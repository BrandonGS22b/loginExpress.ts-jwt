import jwt from 'jsonwebtoken';
import { envs } from './envs';

const JWT_SEED = envs.JWT_SEED;

export class JwtAdapter {

  // Generación del token de manera síncrona
  static generateToken(payload: any, duration: string = '2m'): string | null {
    try {
      return jwt.sign(payload, JWT_SEED, { expiresIn: duration });
    } catch (err) {
      return null; // Si hay un error, devuelve null
    }
  }

  // Validación del token de manera síncrona
  static validateToken<T>(token: string): T | null {
    try {
      return jwt.verify(token, JWT_SEED) as T;
    } catch (err) {
      return null; // Si hay un error, devuelve null
    }
  }
}
