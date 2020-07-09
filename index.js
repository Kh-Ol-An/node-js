require("dotenv").config();
const express = require("express");
const app = express();
var morgan = require('morgan')
const cors = require("cors");
const { userRoter } = require("./contacts/contacts.router");

app.use(morgan('combined'))

app.use(cors());

app.use("/", express.static("public"));

app.use(express.json());

app.use("/api/contacts", userRoter);

app.listen(process.env.PORT, () =>
    console.log("Server listening on port: " + process.env.PORT)
);
