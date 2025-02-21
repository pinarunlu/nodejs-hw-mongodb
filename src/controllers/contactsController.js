import createError from 'http-errors';  // http-errors'ı import ediyoruz
import contactsService from "../services/contacts.js";

const getAllContacts = async (req, res) => {
  const { sortBy, sortOrder, page, perPage } = req.query;

  try {
    const { contacts, totalItems, totalPages, hasPreviousPage, hasNextPage } = await contactsService.getAllContacts(
      sortBy || 'name',   // Varsayılan olarak 'name' ile sıralama
      sortOrder || 'asc',  // Varsayılan olarak 'asc' sıralama
      parseInt(page) || 1, // Varsayılan olarak 1. sayfa
      parseInt(perPage) || 10 // Varsayılan olarak 10 öğe
    );

    res.status(200).json({
      status: 200,
      message: "Successfully found contacts!",
      data: {
        data: contacts,
        page,
        perPage,
        totalItems,
        totalPages,
        hasPreviousPage,
        hasNextPage
      }
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
const createContact = async (req, res) => {
  try {
    const { name, phoneNumber, email, isFavourite, contactType } = req.body;

    // İletişim verilerini service'e gönder
    const newContact = await contactsService.createContact({
      name,
      phoneNumber,
      email,
      isFavourite,
      contactType,
    });

    res.status(201).json({
      status: 201,
      message: "Successfully created a contact!",
      data: newContact,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Error while creating contact",
      error: error.message,
    });
  }
};
const updateContact = async (req, res, next) => {
  const { contactId } = req.params;
  const updatedData = req.body;

  try {
    const updatedContact = await contactsService.updateContact(contactId, updatedData);
    
    if (!updatedContact) {
      throw createError(404, "Contact not found"); // Eğer iletişim bulunmazsa hata fırlat
    }

    res.status(200).json({
      status: 200,
      message: "Successfully patched a contact!",
      data: updatedContact,
    });
  } catch (error) {
    next(error); // Hata yönetimini middleware'e devret
  }
};
const deleteContact = async (req, res, next) => {
  const { contactId } = req.params;

  try {
    const deletedContact = await contactsService.deleteContact(contactId);

    if (!deletedContact) {
      throw createError(404, "Contact not found");
    }

    res.status(204).send(); // 204 No Content
  } catch (error) {
    next(error);
  }
};



const contactsController = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact
};

export default contactsController;
