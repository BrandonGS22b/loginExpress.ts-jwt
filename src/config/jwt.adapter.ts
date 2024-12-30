import jwt, { JwtPayload } from 'jsonwebtoken';
import { envs } from './envs';

const JWT_SEED = envs.JWT_SEED;

export class JwtAdapter {

  // Generación del token de manera síncrona
  static generateToken(payload: Record<string, any>, duration: string = '2m'): string {
    try {
      // Verifica que la duración del token sea válida
      const isValidDuration = /^(\d+)([smhdw])$/.test(duration);
      if (!isValidDuration) {
        throw new Error("Duración de token inválida");
      }
      
      return jwt.sign(payload, JWT_SEED, { expiresIn: duration });
    } catch (err) {
      console.error("Error generando el token:", err);
      throw new Error('Error generando el token'); // Lanzamos un error en lugar de devolver null
    }
  }

  // Validación del token de manera síncrona
  static validateToken<T>(token: string): T {
    try {
      const decoded = jwt.verify(token, JWT_SEED);
      return decoded as T;
    } catch (err) {
      console.error("Token no válido:", err);
      throw new Error('Token no válido'); // Lanzamos un error en lugar de devolver null
    }
  }
}
