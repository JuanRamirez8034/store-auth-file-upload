import { model, Schema, Types } from "mongoose";


const productSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  description: {
    type: String,
    default: 'No avilable description',
  },
  price: {
    type: Number,
    required: [true, 'Price is required']
  },
  available: {
    type: Boolean,
    default: false,
  },
  stock: {
    type: Number,
    default: 0
  },
  category: {
    type: Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  user: {
    type: Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
  },
});

// configurando el objeto de retorno en modo Json
productSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(doc, ret, options) {
      delete ret._id
  },
});

export const ProductModel = model('Product', productSchema);