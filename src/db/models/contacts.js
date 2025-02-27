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
       set: (val) => val.toLowerCase(), // Gelen değeri küçük harfe çevir
    },
    userId: { 
      type: Schema.Types.ObjectId, // userId'yi ekledik
      ref: 'User',  // User modeline referans
      required: true
    },
    photo: {  
      type: String,  // Cloudinary'den gelen fotoğraf URL'si buraya kaydedilecek
      default: "", // Varsayılan olarak boş olabilir
    },
  },
  {
    timestamps: true,
  }
);

export default model('Contact', contactSchema);
