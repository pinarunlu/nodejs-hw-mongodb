
import path from 'path';
import { fileURLToPath } from 'url';

// ES module kullanıldığı için __dirname oluşturulmalı
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// TEMP_UPLOAD_DIR doğru şekilde tanımlanmalı
export const TEMP_UPLOAD_DIR = path.join(__dirname, '..', 'uploads', 'temp');


 