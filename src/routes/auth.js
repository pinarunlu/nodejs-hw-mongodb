import express from "express";
import { registerUserController, login, refreshTokenController } from "../controllers/auth.js";

const router = express.Router();

router.post("/register", registerUserController);
router.post("/login", login);
router.post("/refresh", refreshTokenController); // ✅ Yeni refreshToken endpointi

export default router;

