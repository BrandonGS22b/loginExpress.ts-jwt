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

