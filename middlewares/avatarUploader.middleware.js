const multer = require("multer");

const avatarUploader = () => {
    const storage = multer.diskStorage({
        destination: (req, filename, cb) => {
            cb(null, "public/images");
        },
        filename: (req, filename, cb) => {
            const { _id: id } = req.user;
            const fileFormat = filename.mimetype.split("/")[1];
            cb(null, `${id}.${fileFormat}`);
        },
    });
    return multer({ storage }).single("avatar");
};

module.exports = {
    avatarUploader: avatarUploader(),
};
