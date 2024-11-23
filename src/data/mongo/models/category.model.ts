import { model, Schema, Types } from "mongoose";


const categorySchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    unique: true,
  },
  available: {
    type: Boolean,
    default: false,
  },
  user: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

// configurando el objeto de retorno en modo Json
categorySchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(doc, ret, options) {
      delete ret._id
  },
});

export const CategoryModel = model('Category', categorySchema);