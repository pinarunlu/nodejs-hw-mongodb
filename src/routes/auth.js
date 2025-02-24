import express from "express";
import { registerUserController, login, refreshTokenController, logout } from "../controllers/auth.js";

const router = express.Router();

router.post("/register", registerUserController);
router.post("/login", login);
router.post("/refresh", refreshTokenController); // ✅ Yeni refreshToken endpointi
router.post("/logout", logout);

export default router;

