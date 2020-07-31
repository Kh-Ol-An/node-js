const { Router } = require("express");
const User = require("./contacts.model");
const { authMiddelware } = require("../middlewares/auth.middleware");

const userRouter = Router();

userRouter.get("/api/contacts", authMiddelware, async (req, res) => {
    const users = await User.getUsers();
    res.json(users);
    res.end();
});

userRouter.get("/api/contacts/:contactId", authMiddelware, async (req, res) => {
    const { contactId } = req.params;
    const user = await User.getUserById(contactId);
    user && res.json(user);
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: "Not found" });
    }
    res.end();
});

userRouter.post("/api/contacts", authMiddelware, async (req, res) => {
    const { name, email, phone, subscription, password } = req.body;
    if (name && email && phone && subscription && password) {
        const createdUser = await User.createUserModel(req.body);
        res.status(201).json(createdUser);
    } else {
        res.status(404).json({ message: "missing required name field" });
    }
    res.end();
});

userRouter.delete(
    "/api/contacts/:contactId",
    authMiddelware,
    async (req, res) => {
        const { contactId } = req.params;
        const result = await User.deleteUserById(contactId);
        if (result) {
            res.json({ message: "contact deleted" });
        } else {
            res.status(404).json({ message: "Not found" });
        }
        res.end();
    }
);

userRouter.patch(
    "/api/contacts/:contactId",
    authMiddelware,
    async (req, res) => {
        const { contactId } = req.params;
        const { name, email, phone, subscription, password } = req.body;
        if (name || email || phone || subscription || password) {
            const updatedUser = await User.updateUser(contactId, req.body);
            if (updatedUser) {
                res.json(updatedUser);
            } else {
                res.status(404).json({ message: "Not found" });
            }
        } else {
            res.status(400).json({ message: "missing fields" });
        }
        res.end();
    }
);

userRouter.get("/users/current", authMiddelware, async (req, res) => {
    const { email, subscription } = req.user;
    const result = { email, subscription };
    res.json(result);
    res.end();
});

module.exports = {
    userRouter,
};
