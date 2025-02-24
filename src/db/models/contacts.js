import { model, Schema } from 'mongoose';

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      enum: ['work', 'home', 'personal'],
      required: true,
      default: 'personal',
    },
    userId: { 
      type: Schema.Types.ObjectId, // userId'yi ekledik
      ref: 'User',  // User modeline referans
      required: true
    },
  },
  {
    timestamps: true,
  }
);

export default model('Contact', contactSchema);
