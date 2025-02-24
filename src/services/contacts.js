import Contact from "../db/models/contacts.js";
import createError from 'http-errors';  // http-errors'ı import ediyoruz

const getAllContacts = async (sortBy = 'name', sortOrder = 'asc', page = 1, perPage = 10, isFavourite, type, userId) => {
  try {
    const sortOrderValue = sortOrder === 'desc' ? -1 : 1; // 'asc' için 1, 'desc' için -1
    const skip = (page - 1) * perPage;

    const filter = { userId }; // Kullanıcıya özel filtreleme yapıyoruz

    if (isFavourite !== undefined) {
      filter.isFavourite = isFavourite === 'true'; // 'true' stringini boolean'a çeviriyoruz
    }

    if (type) {
      filter.contactType = type; // İletişim tipi filtreleme
    }

    const contacts = await Contact.find(filter) // Filtreyi buraya ekliyoruz
      .collation({ locale: 'tr', strength: 1 })
      .sort({ [sortBy]: sortOrderValue })
      .skip(skip)
      .limit(perPage);

    if (contacts.length === 0) {
      return { message: "No contacts found" };  // Kayıt yoksa mesaj döndürüyoruz
    }

    const totalItems = await Contact.countDocuments(filter);  // Toplam öğe sayısını filtreli şekilde al

    const totalPages = Math.ceil(totalItems / perPage); // Toplam sayfa sayısını hesapla
    const hasPreviousPage = page > 1;
    const hasNextPage = page < totalPages;

    return {
      contacts,
      page,
      perPage,
      totalItems,
      totalPages,
      hasPreviousPage,
      hasNextPage
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getContactById = async (contactId, userId) => {
  try {
    const contact = await Contact.findOne({ _id: contactId, userId }); // Kullanıcıya ait kontak
    if (!contact) {
      return { message: "Contact not found or access denied" }; // Kullanıcıya ait olmayan kontak
    }
    return contact;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const createContact = async ({ name, phoneNumber, email, isFavourite, contactType, userId }) => {
  try {
    // Yeni iletişim oluşturuluyor
    const newContact = new Contact({
      name,
      phoneNumber,
      email,
      isFavourite: isFavourite || false,  // Varsayılan olarak 'false' kullanıyoruz
      contactType,
      userId,  // Yeni kontağa userId ekliyoruz
    });

    // Veritabanına kaydediyoruz
    await newContact.save();

    // Oluşturulan iletişimi geri döndürüyoruz
    return newContact;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const updateContact = async (contactId, updatedData, userId) => {
  try {
    const updatedContact = await Contact.findOneAndUpdate(
      { _id: contactId, userId }, // Kullanıcıya ait olan kontak
      updatedData,
      {
        new: true, // Yeni veriyi döndürmesini sağlıyoruz
        runValidators: true, // Validasyonları çalıştır
      }
    );
    if (!updatedContact) {
      return { message: "Contact not found or access denied" }; // Kullanıcıya ait olmayan kontak
    }
    return updatedContact;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const deleteContact = async (contactId, userId) => {
  try {
    const deletedContact = await Contact.findOneAndDelete({ _id: contactId, userId });
    
    if (!deletedContact) {
      throw createError(404, "Contact not found or access denied");
    }

    return true; // Başarıyla silindiğinde true dön
  } catch (error) {
    console.error(error);
    throw createError(500, "Database error");
  }
};


export default {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact
};
