const { readFile, writeFile } = require("fs").promises;

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
    const result = JSON.parse(users);
    return result;
};

const getById = async (contactId) => {
    const contacts = await listContacts();
    const result = contacts.find((item) => item.id === contactId);
    return result;
};

const removeContact = async (contactId) => {
    const contacts = await listContacts();
    const result = contacts.filter((item) => item.id !== contactId);
    await writeFile("db/contacts.json", JSON.stringify(result));
    return !(result.length === contacts.length);
};

const addContact = async (user) => {
    const contacts = await listContacts();
    const newId = [...contacts].pop().id + 1;
    const createdUser = new User(user, newId);
    contacts.push(createdUser);
    await writeFile("db/contacts.json", JSON.stringify(contacts));
    return createdUser;
};

const updateContact = async (id, data) => {
    const usersData = await listContacts();
    const result = usersData.map((item) => {
        if (item.id === id) {
            return { ...item, ...data };
        }
        return item;
    });
    if (result !== usersData) {
        await writeFile("db/contacts.json", JSON.stringify(result));
        return result.find((user) => user.id === id);
    } else {
        return false;
    }
};

module.exports = { listContacts, getById, removeContact, addContact, updateContact };
