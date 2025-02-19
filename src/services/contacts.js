import Contact from "../db/models/contacts.js";


const getAllContacts = async () => {
  try {
    const contacts = await Contact.find();
    return contacts;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getContactById = async (contactId) => {
  try {
    const contact = await Contact.findById(contactId);
    return contact;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


const createContact = async ({ name, phoneNumber, email, isFavourite, contactType }) => {
  try {
    // Yeni iletişim oluşturuluyor
    const newContact = new Contact({
      name,
      phoneNumber,
      email,
      isFavourite: isFavourite || false,  // Varsayılan olarak 'false' kullanıyoruz
      contactType,
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
const updateContact = async (contactId, updatedData) => {
  try {
    const updatedContact = await Contact.findByIdAndUpdate(contactId, updatedData, {
      new: true, // Yeni veriyi döndürmesini sağlıyoruz
      runValidators: true, // Validasyonları çalıştır
    });
    return updatedContact;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
const deleteContact = async (contactId) => {
  try {
    const deletedContact = await Contact.findByIdAndDelete(contactId);
    return deletedContact; // Eğer kayıt varsa döner, yoksa null döner
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact
};


