const { Router } = require("express");
const {
    listContacts,
    addContact,
    getById,
    updateContact,
    removeContact,
} = require("./contacts.model");

const userRoter = Router();

userRoter.get("/", async (req, res) => {
    const users = await listContacts();
    res.json(users);
    res.end();
});

userRoter.get("/:contactId", async (req, res) => {
    const { contactId } = req.params;
    const user = await getById(+contactId);
    user && res.json(user);
    if (user) {
        res.json(user);
    } else {
        res.status(404);
        res.json({ message: "Not found" });
    }
    res.end();
});

userRoter.post("/", async (req, res) => {
    const { name, email, phone } = req.body;
    if (name && email && phone) {
        res.status(201);
        const createdUser = await addContact(req.body);
        res.json(createdUser);
    } else {
        res.status(404);
        res.json({ message: "missing required name field" });
    }
    res.end();
});

userRoter.delete("/:contactId", async (req, res) => {
    const { contactId } = req.params;
    const result = await removeContact(+contactId);
    if (result) {
        res.json({ message: "contact deleted" });
    } else {
        res.status(404);
        res.json({ message: "Not found" });
    }
    res.end();
});

userRoter.patch("/:contactId", async (req, res) => {
    const { contactId } = req.params;
    const { name, email, phone } = req.body;
    if (name || email || phone) {
        const updatedUser = await updateContact(+contactId, req.body);
        if (updatedUser) {
            res.json(updatedUser);
        } else {
            res.status(404);
            res.json({ message: "Not found" });
        }
    } else {
        res.status(400);
        res.json({ message: "missing fields" });
    }
    res.end();
});

module.exports = {
    userRoter,
};
