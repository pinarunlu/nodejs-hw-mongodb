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
export default {
    getAllContacts,getContactById
};

