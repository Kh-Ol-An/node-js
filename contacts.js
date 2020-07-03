const { readFile, writeFile } = require("fs").promises;
const { join } = require("path");

const contactsPath = join(__dirname, "contacts.js");
console.log('contactsPath :>> ', contactsPath);

class User {
    constructor({ name, email, phone }, id) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
    }
}

const listContacts = async () => {
    const users = await readFile("db/contacts.json", "utf-8");
    const result = JSON.parse(users)
    console.log("listContacts :>> ");
    console.table(result);
    return result;
};

const getContactById = async (contactId) => {
    const contacts = await listContacts();
    const result = contacts.find((item) => item.id === contactId);
    console.log("getContactById :>> ");
    console.table(result);
    return result;
};

const removeContact = async (contactId) => {
    const contacts = await listContacts();
    const result = contacts.filter((item) => item.id !== contactId);
    await writeFile("db/contacts.json", JSON.stringify(result));
    console.log("removeContact :>> ");
    console.table(result);
    return result;
};

const addContact = async (name, email, phone) => {
    const contacts = await listContacts();
    const newId = [...contacts].pop().id + 1;
    const createdUser = new User({ name, email, phone }, newId);
    contacts.push(createdUser);
    await writeFile("db/contacts.json", JSON.stringify(contacts));
    console.log("addContact :>> ");
    console.table(contacts);
};

module.exports = { listContacts, getContactById, removeContact, addContact };
