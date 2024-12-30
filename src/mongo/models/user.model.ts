import mongoose from 'mongoose';


const userSchema = new mongoose.Schema( {

  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  emailValidated: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  img: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    enum: ['usuario', 'admin', 'tecnico'],
  },
  estado: {
    type: String,
    enum: ['activo', 'inactivo'],
    default: 'activo',
  },
  direccion: {
    type: String,
    required: true,
  },
  telefono: {
    type: String,
    required: true,
    match: [/^[0-9]{10}$/, 'El teléfono debe tener 10 dígitos.'],
  },
  tipodedocumento: {
    type: String,
    required: true,
    enum: ['CC', 'TI', 'Pasaporte', 'Cédula de Extranjería'],
  },
  documento: {
    type: String,
    required: [true, 'El documento es obligatorio.'],
    match: [/^[0-9]{5,15}$/, 'El documento debe tener entre 5 y 15 dígitos.'],
  },
});

userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function( doc, ret, options ) {
    delete ret._id;
    delete ret.password;
  },
})



export const UserModel = mongoose.model('User', userSchema);

