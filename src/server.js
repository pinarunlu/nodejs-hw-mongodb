import express from "express";
import cors from "cors";
import pino from "pino-http";
import dotenv from "dotenv";
import contactsRouter from "./routes/contactsRoutes.js";
import notFoundHandler from "./middlewares/notFoundHandler.js";
import errorHandler from "./middlewares/errorHandler.js";

dotenv.config();

export const setupServer = () => {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Middleware'ler
  app.use(cors());
  app.use(pino());
  app.use(express.json()); // JSON verilerini işlemek için gerekli

  app.use("/contacts", contactsRouter);

  // 404 Middleware
  app.use(notFoundHandler);

  // Hata Yönetimi Middleware
  app.use(errorHandler);

  // Sunucuyu başlat
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
