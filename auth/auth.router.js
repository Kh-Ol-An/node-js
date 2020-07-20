const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../contacts/contacts.model");

// const {
//     validateCreateUserMiddleware,
// } = require("../contacts/contacts.validator");

const { validateLoginMiddleware } = require("./auth.validator");

const authRouter = Router();

authRouter.post("/register", validateLoginMiddleware, async (req, res) => {
    try {
        const { email, password } = req.body;
        const currentUser = await User.getUserWithQuery({ email });
        if (currentUser.length) {
            res.status(409).json({ message: "Email in use" });
        } else {
            const hashPassword = await bcrypt.hash(password, 10);
            const { subscription, email } = await User.createUserModel({
                ...req.body,
                password: hashPassword,
                role: "USER",
            });
            const resultCreate = { user: { email, subscription } };
            res.status(201).json(resultCreate);
        }
    } catch (e) {
        res.status(500).send(e);
    } finally {
        res.end();
    }
});

authRouter.post("/login", validateLoginMiddleware, async (req, res) => {
    try {
        const { email, password } = req.body;
        const currentUser = await User.getUserWithQuery({ email });
        if (!currentUser.length) {
            res.status(401).json("Email or password is wrong");
            return;
        }
        const isEqualPassword = await bcrypt.compare(
            password,
            currentUser[0].password
        );
        if (!isEqualPassword) {
            res.status(401).json("Email or password is wrong");
            return;
        }
        const accces_token = await jwt.sign(
            { id: currentUser[0]._id },
            process.env.PRIVATE_JWT_KEY,
            { expiresIn: "1d" }
        );
        const resultCreate = {
            token: `Bearer ${accces_token}`,
            user: {
                email: currentUser[0].email,
                subscription: currentUser[0].subscription,
            },
        };
        res.json(resultCreate);
    } catch (e) {
        res.status(500).send(e);
    } finally {
        res.end();
    }
});

module.exports = {
    authRouter,
};
