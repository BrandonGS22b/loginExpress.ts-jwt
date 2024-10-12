import { regularExps } from '../config/';

export class RegisterUserDto {
  private constructor(
    public name: string,
    public email: string,
    public password: string,
    public role: string // Añadir role aquí
  ) {}

  static create(object: { [key: string]: any }): [string?, RegisterUserDto?] {
    const { name, email, password, role } = object; // Incluir role en la desestructuración

    if (!name) return ['Missing name'];
    if (!/^[a-zA-Z\s]+$/.test(name)) return ['Name contains invalid characters'];

    if (!email) return ['Missing email'];
    if (!regularExps.email.test(email)) return ['Email is not valid'];

    if (!password) return ['Missing password'];
    if (password.length < 4) return ['Password too short'];

    if (!role) return ['Missing role']; // Validar que el rol esté presente
    if (!['usuario', 'admin', 'tecnico'].includes(role)) return ['Role must be one of: usuario, admin, tecnico']; // Validar que el rol sea uno de los permitidos

    return [undefined, new RegisterUserDto(name, email, password, role)];
  }
}
