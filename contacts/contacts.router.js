const { Router } = require("express");
const User = require("./contacts.model");
const { authMiddelware } = require("../middlewares/auth.middleware");
const { avatarUploader } = require("../middlewares/avatarUploader.middleware");
const { unlink } = require("fs").promises;

const userRouter = Router();

userRouter.get("/api/contacts", authMiddelware, async (req, res) => {
    const { page, limit } = req.query;
    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
    };
    const users = await User.getUsers(options);
    const result = users.docs.map((el) => ({
        subscription: el.subscription,
        _id: el._id,
        name: el.name,
        email: el.email,
        phone: el.phone,
        token: el.token,
    }));
    res.json(result);
    res.end();
});

userRouter.get("/api/contacts/:contactId", authMiddelware, async (req, res) => {
    const { contactId } = req.params;
    const user = await User.getUserById(contactId);
    if (user) {
        const result = {
            subscription: user.subscription,
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            token: user.token,
        };
        res.json(result);
    } else {
        res.status(404).json({ message: "Not found" });
    }
    res.end();
});

userRouter.post("/api/contacts", authMiddelware, async (req, res) => {
    const { name, email, phone, subscription, password } = req.body;
    if (name && email && phone && subscription && password) {
        const createdUser = await User.createUserModel(req.body);
        const result = {
            subscription: createdUser.subscription,
            _id: createdUser._id,
            name: createdUser.name,
            email: createdUser.email,
            phone: createdUser.phone,
            token: createdUser.token,
        };
        res.status(201).json(result);
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
                const result = {
                    subscription: updatedUser.subscription,
                    _id: updatedUser._id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    phone: updatedUser.phone,
                    token: updatedUser.token,
                };
                res.json(result);
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

userRouter.patch("/users/:contactId", authMiddelware, async (req, res) => {
    const { contactId } = req.params;
    const { subscription } = req.body;
    if (subscription) {
        const updatedUser = await User.updateUser(contactId, req.body);
        if (updatedUser) {
            const result = {
                subscription: updatedUser.subscription,
                _id: updatedUser._id,
                name: updatedUser.name,
            };
            res.json(result);
        } else {
            res.status(404).json({ message: "Not found" });
        }
    } else {
        res.status(400).json({ message: "missing fields" });
    }
    res.end();
});

userRouter.post(
    "/users/avatars",
    authMiddelware,
    avatarUploader,
    async (req, res) => {
        try {
            const { _id, avatarName, avatarURL } = req.user;
            const { filename } = req.file;
            await unlink(`public/images/${avatarName}`);
            await User.updateUser(_id, {
                avatarName: `${filename}`,
                avatarURL: `http://locahost:3000/images/${filename}`,
            });
            res.json({ avatarURL });
        } catch (err) {
            res.status(401).json({ message: "Not authorized" });
        }
    }
);

module.exports = {
    userRouter,
};
