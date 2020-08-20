const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../contacts/contacts.model");
const { authMiddelware } = require("../middlewares/auth.middleware");
const { readFile, writeFile, rename } = require("fs").promises;
const Avatar = require("avatar-builder");

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
            const { subscription, email, _id } = await User.createUserModel({
                ...req.body,
                password: hashPassword,
                role: "USER",
            });
            await User.updateUser(_id, {
                avatarName: `${_id}.png`,
                avatarURL: `http://locahost:3000/images/${_id}.png`,
            });
            const resultCreate = { user: { email, subscription } };

            const avatar = Avatar.builder(
                Avatar.Image.margin(
                    Avatar.Image.circleMask(Avatar.Image.identicon())
                ),
                128,
                128,
                { cache: Avatar.Cache.lru() }
            );
            await avatar
                .create("gabriel")
                .then(
                    async (buffer) => await writeFile("tmp/avatar.png", buffer)
                );

            await rename("tmp/avatar.png", `public/images/${_id}.png`);
            res.status(201).json(resultCreate);
        }
    } catch (err) {
        res.status(500).send(err);
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
    } catch (err) {
        res.status(500).send(err);
    } finally {
        res.end();
    }
});

authRouter.post("/logout", authMiddelware, async (req, res) => {
    try {
        const token = req.headers.authorization.replace("Bearer ", "");
        const tokens = JSON.parse(
            await readFile("db/tokenBlackList.json", "utf-8")
        );
        tokens.push(token);
        await writeFile("db/tokenBlackList.json", JSON.stringify(tokens));
        res.status(204);
    } catch (err) {
        res.status(500).send(err);
    } finally {
        res.end();
    }
});

module.exports = {
    authRouter,
};
