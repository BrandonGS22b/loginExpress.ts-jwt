export class UserDto {
    name!: string;
    email!: string;
    password!: string;
    role?: string[] = ['USER_ROLE']; // Valor por defecto
    img?: string; // Opcional
  
    constructor(name: string, email: string, password: string, role?: string[], img?: string) {
      this.name = name;
      this.email = email;
      this.password = password;
      this.role = role;
      this.img = img;
    }
  
    static create(data: Partial<UserDto>): [Error | null, UserDto | null] {
      const { name, email, password, role, img } = data;
      if (!name || !email || !password) {
        return [new Error('Missing required fields'), null];
      }
      return [null, new UserDto(name, email, password, role, img)];
    }
  }
  