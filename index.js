require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
var morgan = require("morgan");
const cors = require("cors");
const { userRoter } = require("./contacts/contacts.router");

const crateServer = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useUnifiedTopology: true,
        });

        console.log("Database connection successful");

        app.use(morgan("combined"));

        app.use(cors());

        app.use("/", express.static("public"));

        app.use(express.json());

        app.use("/api/contacts", userRoter);

        app.listen(process.env.PORT, () =>
            console.log("Server listening on port: " + process.env.PORT)
        );
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

crateServer();
