const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    avatarName: {
        type: String,
        default: "avatar.png",
    },
    avatarURL: {
        type: String,
        default: "../tmp/avatar.png",
    },
    subscription: {
        type: String,
        enum: ["free", "pro", "premium"],
        default: "free",
    },
    password: String,
    token: String,
});

userSchema.plugin(mongoosePaginate);

class User {
    constructor() {
        this.user = mongoose.model("contacts", userSchema);
    }

    getUsers = async (options) => {
        return await this.user.paginate({}, options);
    };

    getUserById = async (id) => {
        return await this.user.findById(id);
    };

    getUserWithQuery = async (query = {}) => {
        return await this.user.find(query);
    };

    createUserModel = async (data) => {
        return await this.user.create(data);
    };

    deleteUserById = async (id) => {
        return await this.user.findByIdAndDelete(id);
    };

    updateUser = async (userId, data) => {
        return await this.user.findByIdAndUpdate(userId, data, { new: true });
    };
}

module.exports = new User();
