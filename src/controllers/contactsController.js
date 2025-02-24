import createError from 'http-errors';  // http-errors'ı import ediyoruz
import contactsService from "../services/contacts.js";

const getAllContacts = async (req, res) => {
  const { sortBy, sortOrder, page, perPage } = req.query;

  try {
    // Kullanıcının _id'sini alıyoruz
    const userId = req.user._id;
    

    const { contacts, totalItems, totalPages, hasPreviousPage, hasNextPage } = await contactsService.getAllContacts(
      sortBy || 'name', 
      sortOrder || 'asc', 
      parseInt(page) || 1, 
      parseInt(perPage) || 10,
      userId  // Kullanıcıya ait kontakları alacağız
    );

    res.status(200).json({
      status: 200,
      message: "Successfully found contacts!",
      
        data: contacts,
        page,
        perPage,
        totalItems,
        totalPages,
        hasPreviousPage,
        hasNextPage
      
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
    const userId = req.user._id;  // Kullanıcının _id'sini alıyoruz
    const contact = await contactsService.getContactById(req.params.id, userId);  // Kullanıcıya ait kontağı alacağız

    if (!contact) {
      throw createError(404, "Contact not found");
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${req.params.id}!`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};const createContact = async (req, res) => {
  try {
    const { name, phoneNumber, email, isFavourite, contactType } = req.body;

    // Kullanıcının _id'sini alıyoruz
    const userId = req.user._id;

    // İletişim verilerini service'e gönderirken userId'yi de ekliyoruz
    const newContact = await contactsService.createContact({
      name,
      phoneNumber,
      email,
      isFavourite,
      contactType,
      userId,  // userId'yi buraya ekledik
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
    const userId = req.user._id;  // Kullanıcının _id'sini alıyoruz
    const updatedContact = await contactsService.updateContact(contactId, updatedData, userId);  // Kullanıcıya ait kontağı güncelleyeceğiz

    if (!updatedContact) {
      throw createError(404, "Contact not found");
    }

    res.status(200).json({
      status: 200,
      message: "Successfully patched a contact!",
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};
const deleteContact = async (req, res, next) => {
  const { contactId } = req.params;

  try {
    const userId = req.user._id;  // Kullanıcının _id'sini alıyoruz
    const deletedContact = await contactsService.deleteContact(contactId, userId);  // Kullanıcıya ait kontağı sileceğiz

    if (!deletedContact) {
      throw createError(404, "Contact not found");
    }

    res.status(204).send(); 
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
