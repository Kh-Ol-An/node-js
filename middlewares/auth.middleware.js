const jwt = require("jsonwebtoken");
const User = require("../contacts/contacts.model");

const authMiddelware = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            res.status(401).json({ message: "Not authorized" });
            return;
        }
        const parsedToken = token.replace("Bearer ", "");
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
