import { regularExps } from '../config/';

const ALLOWED_ROLES = ['usuario', 'admin', 'tecnico','auxiliar'] as const;
const ALLOWED_DOCUMENT_TYPES = ['CC', 'TI', 'CE', 'PASSPORT'] as const; // Ejemplo de tipos de documento

export class RegisterUserDto {
  private constructor(
    public name: string,
    public email: string,
    public password: string,
    public role: typeof ALLOWED_ROLES[number],
    public direccion: string,
    public telefono: string,
    public tipodedocumento: typeof ALLOWED_DOCUMENT_TYPES[number],
    public documento: number
  ) {}

  static create(object: { [key: string]: any }): [string?, RegisterUserDto?] {
    const { 
      name, 
      email, 
      password, 
      role, 
      direccion, 
      telefono, 
      tipodedocumento, 
      documento 
    } = object;

    // Validación del nombre
    if (!name) return ['Name is required'];
    if (!/^[a-zA-Z\s]+$/.test(name)) return ['Name can only contain letters and spaces'];

    // Validación del email
    if (!email) return ['Email is required'];
    if (!regularExps.email.test(email)) return ['Email is not valid'];

    // Validación de la contraseña
    if (!password) return ['Password is required'];
    if (password.length < 4) return ['Password must be at least 4 characters long'];

    // Validación del rol
    if (!role) return ['Role is required'];
    if (!ALLOWED_ROLES.includes(role)) {
      return [`Role must be one of: ${ALLOWED_ROLES.join(', ')}`];
    }

    // Validación de dirección
    if (!direccion) return ['Address (direccion) is required'];

    // Validación de teléfono
    if (!telefono) return ['Phone number (telefono) is required'];
    if (!/^\d+$/.test(telefono)) return ['Phone number must contain only digits'];

    // Validación del tipo de documento
    if (!tipodedocumento) return ['Document type (tipodedocumento) is required'];
    if (!ALLOWED_DOCUMENT_TYPES.includes(tipodedocumento)) {
      return [`Document type must be one of: ${ALLOWED_DOCUMENT_TYPES.join(', ')}`];
    }

    // Validación del documento
    if (!documento) return ['Document number (documento) is required'];
    if (!Number.isInteger(documento)) return ['Document number must be an integer'];

    // Si pasa todas las validaciones
    return [undefined, new RegisterUserDto(name, email, password, role, direccion, telefono, tipodedocumento, documento)];
  }
}
