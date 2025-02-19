import createError from 'http-errors';  // http-errors'ı import ediyoruz
import contactsService from "../services/contacts.js";

const getAllContacts = async (req, res) => {
  try {
    const contacts = await contactsService.getAllContacts();
    res.status(200).json({
      status: 200,
      message: "Successfully found contacts!",
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Error while getting contacts",
      error: error.message,
    });
  }
};

const getContactById = async (req, res, next) => {
  try {
    const contact = await contactsService.getContactById(req.params.id);

    // Eğer contact bulunamazsa, http-errors ile hata oluşturuyoruz
    if (!contact) {
      throw createError(404, "Contact not found");
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${req.params.id}!`,
      data: contact,
    });
  } catch (error) {
    // errorHandler middleware ile otomatik olarak işlenecek
    next(error);
  }
};

const contactsController = {
  getAllContacts,
  getContactById,
};

export default contactsController;
