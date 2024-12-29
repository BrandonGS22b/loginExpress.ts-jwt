import mongoose from 'mongoose';


const userSchema = new mongoose.Schema( {

  name: {
    type: String,
    required: [ true, 'Name is required' ]
  },
  email: {
    type: String,
    required: [ true, 'Email is required' ],
    unique: true,
  },
  emailValidated: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: [ true, 'Password is required' ]
  },
  img: {
    type: String,
    required: false
  },
  role: {
    type: String,
    required: [true, 'Role is required= usuario-admin-tecnico'],
    enum: ['usuario', 'admin', 'tecnico'],
    message: 'Role must be either usuario, admin, or tecnico',
  },
  estado: {
    type: String,
    enum: ['activo', 'inactivo'],
    default: 'activo', // Estado inicial predeterminado
  },
  direccion:{
    type: String,
    required: true
},
telefono:{
  type: String,
  required: true
},

tipodedocumento:{
  type: String,
  required: true
},
documento: {
  type: String, // Cambiado a String para más flexibilidad.
  required: [true, 'El documento es obligatorio.'],
  match: [/^[0-15]{5,15}$/, 'El documento debe tener entre 5 y 10 dígitos.'],
},

} );

userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function( doc, ret, options ) {
    delete ret._id;
    delete ret.password;
  },
})



export const UserModel = mongoose.model('User', userSchema);

