const jwt = require("jsonwebtoken");
const User = require("../contacts/contacts.model");
const { readFile } = require("fs").promises;

const authMiddelware = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        console.log('token :>> ', token);
        if (!token) {
            res.status(401).json({ message: "Not authorized" });
            return;
        }
        const tokenBlackList = JSON.parse(
            await readFile("db/tokenBlackList.json", "utf-8")
        );
        const parsedToken = token.replace("Bearer ", "");
        tokenBlackList.find((el) => {
            if (el === parsedToken) {
                res.status(401).json({ message: "Not authorized" });
                return;
            }
        });
        const data = await jwt.verify(parsedToken, process.env.PRIVATE_JWT_KEY);
        const user = await User.getUserById(data.id);
        req.user = user;
        next();
    } catch (e) {
        res.status(401).json({ message: "Not authorized" });
    }
};

module.exports = {
    authMiddelware,
};
