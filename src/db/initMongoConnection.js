import mongoose from 'mongoose';
import { env } from '../utils/env.js';  // env fonksiyonunu import et

export const initMongoConnection = async () => {
  try {
    // env fonksiyonu ile çevresel değişkeni al
    const mongoURI = `mongodb+srv://${env('MONGODB_USER')}:${env('MONGODB_PASSWORD')}@${env('MONGODB_URL')}/${env('MONGODB_DB')}?retryWrites=true&w=majority`;
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Mongo connection successfully established!');

  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};


