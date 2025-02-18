import express from "express";
import cors from "cors";
import pino from "pino-http";
import dotenv from "dotenv";  // dotenv'i ekledik
import contactsRouter from "./routes/contactsRoutes.js";

dotenv.config();  // .env dosyasındaki çevresel değişkenleri yükler

export const setupServer = () => {
  const app = express();
  const PORT = process.env.PORT || 3000; // process.env.PORT kullanıyoruz

  // Middleware'ler
  app.use(cors());
  app.use(pino());

  app.use('/contacts', contactsRouter);
  // Mevcut olmayan rotalar için 404 hatası
  app.use((req, res) => {
    res.status(404).json({ message: "Not found" });
  });

  // Sunucuyu başlat
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
