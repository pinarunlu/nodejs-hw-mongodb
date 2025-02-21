import express from "express";
import contactsController from "../controllers/contactsController.js";
import ctrlWrapper from "../utils/ctrlWrapper.js";
import validateBody from "../middlewares/validateBody.js";
import isValidId from "../middlewares/isValidId.js";
import { contactSchema, updateContactSchema } from "../schemas/contactSchema.js";

const router = express.Router();

router.get("/", ctrlWrapper(contactsController.getAllContacts)); // Sıralama ve sayfalandırma burada yapılacak
router.get("/:contactId", isValidId, ctrlWrapper(contactsController.getContactById)); 
router.post("/", validateBody(contactSchema), ctrlWrapper(contactsController.createContact));
router.patch("/:contactId", isValidId, validateBody(updateContactSchema), ctrlWrapper(contactsController.updateContact)); 
router.delete("/:contactId", isValidId, ctrlWrapper(contactsController.deleteContact));
router.get("/", async (req, res, next) => {
  const { sortBy, sortOrder, page, perPage, isFavourite, type } = req.query;
  try {
    const result = await contactsController.getAllContacts(
      sortBy, 
      sortOrder, 
      page, 
      perPage, 
      isFavourite, 
      type
    );
    res.json({
      status: 200,
      message: 'Successfully found contacts!',
      data: result
    });
  } catch (error) {
    next(error);
  }
});

export default router;

