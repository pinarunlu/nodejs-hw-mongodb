import express from "express";
import cors from "cors";
import pino from "pino-http";
import dotenv from "dotenv";
import contactsRouter from "./routes/contactsRoutes.js";
import authRouter from "./routes/auth.js";  // auth.js dosyasını doğru şekilde import ediyoruz
import notFoundHandler from "./middlewares/notFoundHandler.js";
import errorHandler from "./middlewares/errorHandler.js";
import cookieParser from "cookie-parser";
import setupSwagger from "../swagger/swagger.js";

dotenv.config();

export const setupServer = () => {
  const app = express();

  setupSwagger(app);
  const PORT = process.env.PORT || 3000;

  // Middleware'ler
  app.use(cors());
  app.use(pino());
  app.use(express.json()); // JSON verilerini işlemek için gerekli
  app.use(cookieParser()); // Cookie middleware'i ekle

  app.post('/auth/reset-pwd', (req, res) => {
    try {
        console.log("Gelen istek:", req.body); // Terminalde görmek için
        res.status(200).json({
      status: "success",
      message: "Password has been successfully reset.",
      data: {}
    });
    } catch (error) {
        console.error("Hata oluştu:", error);
        res.status(500).json({ error: "Sunucu hatası" });
    }
  });
  app.post('/auth/send-reset-email', (req, res) => {
    try {
        console.log("Gelen istek:", req.body); // Terminalde görmek için
       res.status(200).json({
      status: "success",
      message: "Reset password email has been successfully sent.",
      data: {},
    });
    } catch (error) {
        console.error("Hata oluştu:", error);
        res.status(500).json({ error: "Sunucu hatası" });
    }
  });
  

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
