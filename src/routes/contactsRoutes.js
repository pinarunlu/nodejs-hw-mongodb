import express from "express";
import contactsController from "../controllers/contactsController.js";
import ctrlWrapper from "../utils/ctrlWrapper.js";
import validateBody from "../middlewares/validateBody.js";
import isValidId from "../middlewares/isValidId.js";
import { contactSchema, updateContactSchema } from "../schemas/contactSchema.js";
import authenticate from "../middlewares/authenticate.js";

const router = express.Router();

// Kullanıcının kendi kontaklarını listelemesi için userId filtresi eklendi
router.get("/", authenticate, ctrlWrapper(contactsController.getAllContacts));

// Belirli bir kontak bilgisini getirirken userId doğrulaması eklenmiş oldu
router.get("/:contactId", authenticate, isValidId, ctrlWrapper(contactsController.getContactById)); 

// Yeni kontak oluştururken userId otomatik olarak req.user._id'den alınacak
router.post("/", authenticate, validateBody(contactSchema), ctrlWrapper(contactsController.createContact));

// Kullanıcı yalnızca kendi kontaklarını güncelleyebilir
router.patch("/:contactId", authenticate, isValidId, validateBody(updateContactSchema), ctrlWrapper(contactsController.updateContact)); 

// Kullanıcı yalnızca kendi kontaklarını silebilir
router.delete("/:contactId", authenticate, isValidId, ctrlWrapper(contactsController.deleteContact));

export default router;

