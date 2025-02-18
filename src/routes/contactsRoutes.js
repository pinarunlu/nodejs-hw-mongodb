import express from "express";
import contactsController from "../controllers/contactsController.js";  // Default import

const router = express.Router();

router.get("/", contactsController.getAllContacts); // getAllContacts fonksiyonunu kullanıyoruz
router.get("/:id", contactsController.getContactById); // ID'ye göre bir kontağı getir
export default router;
