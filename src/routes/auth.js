import express from "express";
import { 
  registerUserController, 
  login, 
  refreshTokenController, 
  logout, 
  sendResetEmail, 
  resetPassword 
} from "../controllers/auth.js";
import validateBody from "../middlewares/validateBody.js";
import { 
  sendResetEmailSchema, 
  resetPasswordSchema 
} from "../schemas/contactSchema.js";  // Şema dosyasını import edin

const router = express.Router();

// /register route'u: registerUserController fonksiyonu doğru şekilde kullanılıyor
router.post("/register", registerUserController);  // validateBody fonksiyonu ile registerUserSchema'yı geçiyoruz

// /login route'u
router.post("/login", login);  // Giriş için bir doğrulama şeması eklenmeli (loginSchema)

router.post("/refresh", refreshTokenController); // ✅ Yeni refreshToken endpointi
router.post("/logout", logout);

// Şifre sıfırlama e-postası gönderme endpoint'i
router.post("/send-reset-email", validateBody(sendResetEmailSchema), sendResetEmail);

// Şifre sıfırlama endpoint'i
router.post("/reset-pwd", validateBody(resetPasswordSchema), resetPassword); 

export default router;

