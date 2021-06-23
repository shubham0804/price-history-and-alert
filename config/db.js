const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const config = require("./env.json")[process.env.NODE_ENV || "development"];
const mongoose = require("mongoose");
const db = mongoose.connection;

mongoose.connect(config.dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
});

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
    // we're connected!
    console.log("Db Connected!");
});
