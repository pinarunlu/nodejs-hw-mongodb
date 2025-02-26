import Joi from "joi";

export const contactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  phoneNumber: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().optional(),
  isFavourite: Joi.boolean().optional(),
  contactType: Joi.string().valid("Personal", "Work").required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).optional(),
  phoneNumber: Joi.string().min(3).max(20).optional(),
  email: Joi.string().email().optional(),
  isFavourite: Joi.boolean().optional(),
  contactType: Joi.string().valid("Personal", "Work").optional(),
}).min(1);

// Şifre sıfırlama talebi için e-posta adresi doğrulama
export const sendResetEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});
// Şifre sıfırlama işlemi için doğrulama şeması
export const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),  // token, genellikle e-posta ile gönderilir
  password: Joi.string().min(6).required(),  // minimum 6 karakter şifre
});
