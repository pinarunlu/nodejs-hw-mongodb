import dotenv from 'dotenv';

// .env dosyasındaki çevresel değişkenleri yükle
dotenv.config();

// Çevresel değişkeni al ve varsayılan değerle birlikte döndür
export function env(name, defaultValue) {
  const value = process.env[name];

  if (value) return value;

  if (defaultValue) return defaultValue;

  // Eğer değer yoksa hata fırlat
  throw new Error(`Missing: process.env['${name}'].`);
}
