import express from "express";
import contactsController from "../controllers/contactsController.js";
import ctrlWrapper from "../utils/ctrlWrapper.js";  // ctrlWrapper'ı import ediyoruz

const router = express.Router();

router.get("/", ctrlWrapper(contactsController.getAllContacts)); // getAllContacts fonksiyonunu ctrlWrapper ile sarmalıyoruz
router.get("/:id", ctrlWrapper(contactsController.getContactById)); // getContactById fonksiyonunu ctrlWrapper ile sarmalıyoruz
// POST rotası - Yeni iletişim oluşturma
router.post("/", contactsController.createContact);
router.patch("/:contactId", contactsController.updateContact); // Yeni PATCH rotası
router.delete("/:contactId", contactsController.deleteContact); // Yeni DELETE rotası


export default router;
