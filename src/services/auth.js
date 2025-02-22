import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import User from "../db/models/User.js";

export const registerUserService = async ({ name, email, password }) => {
  // Aynı e-posta adresine sahip kullanıcı var mı?
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(409, "Email in use");
  }

  // Şifreyi hashle 🔐
  const hashedPassword = await bcrypt.hash(password, 10);

  // Yeni kullanıcıyı oluştur
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  // Şifreyi yanıt içinde göndermeyelim
  const userWithoutPassword = newUser.toObject();
delete userWithoutPassword.password;

  return userWithoutPassword;
};
