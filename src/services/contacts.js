import Contact from "../db/models/contacts.js";


const getAllContacts = async (sortBy = 'name', sortOrder = 'asc', page = 1, perPage = 10, isFavourite, type) => {
  try {
    const sortOrderValue = sortOrder === 'desc' ? -1 : 1; // 'asc' için 1, 'desc' için -1
    const skip = (page - 1) * perPage;

 const filter = {};  // Filtreyi başlatıyoruz

    if (isFavourite !== undefined) {
      filter.isFavourite = isFavourite === 'true'; // 'true' stringini boolean'a çeviriyoruz
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


