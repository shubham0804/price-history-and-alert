require("../../config/db");
const fs = require("fs");
const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());
const port = 3001;

const { handleOnMessage } = require("./middlewares/handlers/webhook");

// Dev Only
const localtunnel = require("localtunnel");
// const localtunnel = require("sharetunnel");
localtunnel({ port, subdomain: "ispricerightwebhook" }).then((tunnel) => {
    console.log(tunnel.url);
    fs.writeFile(`data/webhook-url.txt`, tunnel.url, (err) => err && console.log(err));
});
// Dev Only

app.post("/onMessage", handleOnMessage);

app.listen(port, () => console.log(`Server is running on port ${port}`));
