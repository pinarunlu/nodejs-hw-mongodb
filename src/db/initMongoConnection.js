import mongoose from 'mongoose';
import { env } from '../utils/env.js';  // env fonksiyonunu import et

export const initMongoConnection = async () => {
  try {
    // env fonksiyonu ile çevresel değişkeni al
    const user = env('MONGODB_USER');
    const password = env('MONGODB_PASSWORD');
    const url = env('MONGODB_URL');
    const db = env('MONGODB_DB');
    const mongoURI = `mongodb+srv://${user}:${password}@${url}/${db}?retryWrites=true&w=majority`;

    await mongoose.connect(mongoURI, {
      // Eski seçenekler artık gereksiz
      // useNewUrlParser: true,   // Bu satırı kaldırın
      // useUnifiedTopology: true, // Bu satırı kaldırın
    });

    console.log('Mongo connection successfully established!');

  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};
