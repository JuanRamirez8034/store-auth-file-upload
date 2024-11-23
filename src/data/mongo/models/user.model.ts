import { Schema, model } from "mongoose";


const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is requiered'],
  },
  email: {
    type: String,
    required: [true, 'Email is requiered'],
    unique: true,
  },
  emailValidated: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: [true, 'password is requiered'],
  },
  image: {
    type: String,
    default: null,
  },
  role: {
    type: [String],
    enum: ['admin', 'user'],
    default: ['user'],
  },
});

// configurando el objeto de retorno en modo Json
userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(doc, ret, options) {
      delete ret._id;
      delete ret.password;
  },
});

export const UserModel = model('User', userSchema);