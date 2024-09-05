import { regularExps } from '../config/';

export class GetUserDto {

  private constructor(
    public id?: string,
    public email?: string,
  ) {}

  static create(object: { [key: string]: any }): [string?, GetUserDto?] {
    const { id, email } = object;

    // Si hay un ID, valida que no esté vacío
    if (id && typeof id !== 'string') return ['Invalid id'];

    // Si hay un email, valida que sea correcto
    if (email && !regularExps.email.test(email)) return ['Email is not valid'];

    // Si no se proporciona ni ID ni email
    if (!id && !email) return ['Missing id or email'];

    // Si pasa las validaciones, crea la instancia del DTO
    return [undefined, new GetUserDto(id, email)];
  }
}
