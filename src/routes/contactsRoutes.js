import express from "express";
import contactsController from "../controllers/contactsController.js";
import ctrlWrapper from "../utils/ctrlWrapper.js";  // ctrlWrapper'ı import ediyoruz

const router = express.Router();

router.get("/", ctrlWrapper(contactsController.getAllContacts)); // getAllContacts fonksiyonunu ctrlWrapper ile sarmalıyoruz
router.get("/:id", ctrlWrapper(contactsController.getContactById)); // getContactById fonksiyonunu ctrlWrapper ile sarmalıyoruz

export default router;
