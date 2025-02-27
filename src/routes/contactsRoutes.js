import express from "express";
import contactsController from "../controllers/contactsController.js";
import ctrlWrapper from "../utils/ctrlWrapper.js";
import validateBody from "../middlewares/validateBody.js";
import isValidId from "../middlewares/isValidId.js";
import { contactSchema, updateContactSchema } from "../schemas/contactSchema.js";
import authenticate from "../middlewares/authenticate.js";
import upload from "../middlewares/upload.js";
import uploadToCloudinary from "../services/uploadService.js";
import Contact from "../db/models/contacts.js";

const router = express.Router();

// Kullanıcının kendi kontaklarını listelemesi için userId filtresi eklendi
router.get("/", authenticate, ctrlWrapper(contactsController.getAllContacts));

// Belirli bir kontak bilgisini getirirken userId doğrulaması eklenmiş oldu
router.get("/:contactId", authenticate, isValidId, ctrlWrapper(contactsController.getContactById)); 

// Yeni kontak oluştururken userId otomatik olarak req.user._id'den alınacak
router.post("/", authenticate, upload.single("photo"), validateBody(contactSchema), async (req, res) => {
  try {
    const { name, phoneNumber, email, contactType } = req.body;
    const userId = req.user._id;  // Kullanıcının _id'sini alıyoruz

    let photoUrl = null;
    // Eğer fotoğraf yüklenmişse Cloudinary'ye yükle
    if (req.file) {
      photoUrl = await uploadToCloudinary(req.file.buffer);
      console.log("Yüklenen dosya bilgisi:", req.file);
    }

    // Yeni contact oluşturuyoruz
    const newContact = new Contact({
      name,
      phoneNumber,
      email,
      contactType,
      userId,
      photo: photoUrl,  // Cloudinary'den gelen URL'yi kaydediyoruz
    });

    await newContact.save();
    res.status(201).json({
      status: 201,
      message: "Contact created successfully",
      data: newContact,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Kullanıcı yalnızca kendi kontaklarını güncelleyebilir
router.patch("/:contactId", authenticate, isValidId, upload.single("photo"), validateBody(updateContactSchema), async (req, res) => {
  try {
    const { contactId } = req.params;
    const updateFields = req.body;

    // Fotoğraf yüklenmişse, fotoğrafı Cloudinary'ye yükle ve URL'yi ekle
    if (req.file) {
      updateFields.photo = await uploadToCloudinary(req.file.buffer);
    }

    const updatedContact = await Contact.findByIdAndUpdate(
      contactId,
      updateFields,
      { new: true }
    );

    if (!updatedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.json({
      status: 200,
      message: "Contact updated successfully",
      data: updatedContact,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Kullanıcı yalnızca kendi kontaklarını silebilir
router.delete("/:contactId", authenticate, isValidId, ctrlWrapper(contactsController.deleteContact));

export default router;
