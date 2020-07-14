const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: String,
        email: String,
        phone: String,
        subscription: String,
        password: String,
    },
    { versionKey: false }
);

class User {
    constructor() {
        this.user = mongoose.model("contacts", userSchema);
    }

    getUsers = async () => {
        return await this.user.find();
    };

    getUserById = async (id) => {
        return await this.user.findById(id);
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
