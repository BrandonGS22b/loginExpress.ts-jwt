import { JwtAdapter, bcryptAdapter, envs } from '../../config';
import { UserModel } from '../../mongo/models/user.model';
import { LoginUserDto } from '../../auth/login-user.dto';
import { RegisterUserDto } from '../../auth/register-user.dto';
import { EmailService } from './email.service';

export class AuthService {

  // DI
  constructor(
    // DI - Email Service
    private readonly emailService: EmailService,
  ) {}

  public async registerUser(registerUserDto: RegisterUserDto) {
    // Verificar si el usuario ya existe por email
    const existUser = await UserModel.findOne({ email: registerUserDto.email });
    if (existUser) throw new Error('Email already exists');
    
    try {
      // Crear nuevo usuario con los datos proporcionados
      const user = new UserModel(registerUserDto);
      
      // Encriptar la contraseña
      user.password = await bcryptAdapter.hash(registerUserDto.password); // Usar 'await' para esperar la encriptación
      
      // Guardar el usuario en la base de datos
      await user.save();
  
      // Enviar enlace de confirmación de email
      await this.sendEmailValidationLink(user.email);
  
      // Excluir el campo de contraseña de la respuesta
      const { password, ...userEntity } = user.toObject();
  
      // Generar token JWT
      const token = await JwtAdapter.generateToken({ id: user.id });
      if (!token) throw new Error('Error while creating JWT');
  
      // Devolver el usuario sin contraseña y el token generado
      return { 
        user: userEntity, 
        token: token,
      };
  
    } catch (error) {
      // Manejar cualquier error que ocurra durante el proceso
      if (error instanceof Error) {
        console.error(`Error: ${error.message}`); // Loguear el error para depuración
        throw new Error(`Internal server error: ${error.message}`);
      } else {
        throw new Error('An unknown error occurred');
      }
    }
  }
  

  public async loginUser(loginUserDto: LoginUserDto) {
    const user = await UserModel.findOne({ email: loginUserDto.email });
    if (!user) throw new Error('Email does not exist');

    const isMatching = bcryptAdapter.compare(loginUserDto.password, user.password);
    if (!isMatching) throw new Error('Password is not valid');

    const { password, ...userEntity } = user.toObject(); // No usar UserEntity
    
    const token = await JwtAdapter.generateToken({ id: user.id });
    if (!token) throw new Error('Error while creating JWT');

    return {
      user: userEntity,
      token: token,
      
    };
  }

  private sendEmailValidationLink = async(email: string) => {
    const token = await JwtAdapter.generateToken({ email });
    if (!token) throw new Error('Error generating token');

    const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;
    const html = `
      <h1>Validate your email</h1>
      <p>Click on the following link to validate your email</p>
      <a href="${link}">Validate your email: ${email}</a>
    `;

    const options = {
      to: email,
      subject: 'Validate your email',
      htmlBody: html,
    };

    const isSent = await this.emailService.sendEmail(options);
    if (!isSent) throw new Error('Error sending email');

    return true;
  }

  public validateEmail = async(token: string) => {
    const payload = await JwtAdapter.validateToken(token);
    if (!payload) throw new Error('Invalid token');

    const { email } = payload as { email: string };
    if (!email) throw new Error('Email not in token');

    const user = await UserModel.findOne({ email });
    if (!user) throw new Error('Email does not exist');

    user.emailValidated = true;
    await user.save();

    return true;
  }

  public async getAllUsers() {
    try {
      const users = await UserModel.find(); // Busca todos los usuarios
      return users;
    } catch (error) {
      throw new Error('Error fetching users');
    }
  }


//peticion para  actualizar  usuarios 

public async updateUserById(userId: string, updateData: Partial<RegisterUserDto>) {
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Actualizar solo los campos que se proporcionan en `updateData`
    Object.assign(user, updateData);

    // Si se proporciona una contraseña, encriptarla antes de guardar
    if (updateData.password) {
      user.password = await bcryptAdapter.hash(updateData.password);
    }

    await user.save();

    const { password, ...updatedUser } = user.toObject();

    return updatedUser;
  } catch (error) {
    throw new Error('Error actualizar usaurio');
  }
}


//eliminar por id 
public async deleteUserById(userId: string) {
  try {
    const user = await UserModel.findByIdAndDelete(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return { message: 'User deleted successfully' };
  } catch (error) {
    throw new Error('Error al eliminar usuario');
  }
}


//buscar por id 
public async getUserById(userId: string) {
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    const { password, ...userEntity } = user.toObject(); // Excluir la contraseña
    return userEntity;
  } catch (error) {
    throw new Error('Error al buscar usuario');
  }
}





  //peticion al modelo para guardar la imagen

  public async updateUserImage(userId: string, imageUrl: string) {
    try {
      const user = await UserModel.findById(userId);
  
      // Verificar si el usuario existe
      if (!user) {
        return { error: 'User not found' };
      }
  
      // Validar que se haya proporcionado una URL de imagen
      if (!imageUrl) {
        return { error: 'Invalid image URL' };
      }
  
      // Actualizar la imagen
      user.img = imageUrl;
  
      // Guardar el usuario actualizado
      await user.save();
  
      // Retornar el usuario actualizado
      return {
        message: 'User image updated successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          img: user.img, // Aquí se devuelve la nueva URL de la imagen
        },
      };
    } catch (error) {
      // Capturar y manejar cualquier otro error
      return { error: 'Error updating user image' };
    }
  }
  




  public async getTechnicians() {
    try {
      const technicians = await UserModel.find({ role: 'tecnico' }); // Asegúrate de que 'technician' es el rol que has definido para técnicos.
      return technicians.map(tech => {
        const { password, ...techEntity } = tech.toObject(); // Excluir la contraseña
        return techEntity;
      });
    } catch (error) {
      throw new Error('Error fetching technicians');
    }
  }

//para obtener por id 

public async getTechnicianById(userId: string) {
  try {
    // Busca el técnico por ID y rol 'tecnico'
    const technician = await UserModel.findOne({ _id: userId, role: 'tecnico' });

    if (!technician) {
      throw new Error('Technician not found');
    }

    // Excluir la contraseña antes de devolver el objeto
    const { password, ...techEntity } = technician.toObject();
    return techEntity;

  } catch (error) {
    console.error('Error getting technician:', error);
    throw new Error('Error getting technician');
  }
}



public async getUsuariosConRol() {
  try {
    // Busca todos los usuarios con el rol 'usuario'
    const usuarios = await UserModel.find({ role: 'usuario' });

    // Si no hay usuarios, lanzamos un error
    if (!usuarios || usuarios.length === 0) {
      throw new Error('No users found');
    }

    // Excluir la contraseña antes de devolver los objetos
    const usuariosSinContrasenia = usuarios.map(usuario => {
      const { password, ...usuarioSinContrasenia } = usuario.toObject();
      return usuarioSinContrasenia;
    });

    return usuariosSinContrasenia;

  } catch (error) {
    console.error('Error getting users:', error);
    throw new Error('Error getting users');
  }
}



  
  public async assignTechnician(userId: string, taskId: string) {
    try {
      const user = await UserModel.findById(userId);
      if (!user || user.role !== 'tecnico') {
        throw new Error('Technician not found');
      }
      return { message: 'Technician assigned successfully' };
    } catch (error) {
      throw new Error('Error assigning technician');
    }
  }
  
}
