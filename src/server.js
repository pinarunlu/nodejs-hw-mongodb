import express from "express";
import cors from "cors";
import pino from "pino-http";
import dotenv from "dotenv";
import contactsRouter from "./routes/contactsRoutes.js";
import authRouter from "./routes/auth.js";  // auth.js dosyasını doğru şekilde import ediyoruz
import notFoundHandler from "./middlewares/notFoundHandler.js";
import errorHandler from "./middlewares/errorHandler.js";
import cookieParser from "cookie-parser";

dotenv.config();

export const setupServer = () => {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Middleware'ler
  app.use(cors());
  app.use(pino());
  app.use(express.json()); // JSON verilerini işlemek için gerekli
  app.use(cookieParser()); // Cookie middleware'i ekle

  // Routes
  app.use("/contacts", contactsRouter);  // Mevcut contacts route'u
  app.use("/auth", authRouter);  // auth.js'i "/auth" yoluna yönlendirdik

  // 404 Middleware
  app.use(notFoundHandler);

  // Hata Yönetimi Middleware
  app.use(errorHandler);

  // Sunucuyu başlat
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
