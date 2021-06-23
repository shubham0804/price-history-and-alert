require("../../config/db");
const path = require("path");
const wa = require("@open-wa/wa-automate");
const express = require("express");

const { verifyLabels, registerWebhooks } = require("./middlewares/misc");
const { handleMessageCollector } = require("./middlewares/collector");

const app = express();
app.use(express.json());
const PORT = 8001;
const os = process.platform;
let sessionId;
if (os === "win32") {
    sessionId = __filename.split("\\").pop().replace(".js", "");
} else {
    sessionId = __filename.split("/").pop().replace(".js", "");
}
// Dev Only
const localtunnel = require("localtunnel");
const fs = require("fs");
let sessionUrl;
localtunnel({ port: PORT, subdomain: "session1" }).then((tunnel) => {
    console.log(tunnel.url);
    fs.writeFile(
        `data/${sessionId}-url.txt`,
        // path.resolve(process.cwd(), "data", `${sessionId}-url.txt`),
        // `${process.cwd()}\\data\\${sessionId}-url.txt`,
        tunnel.url,
        (err) => err && console.log(err)
    );
    sessionUrl = tunnel.url;
});
// Dev Only

const start = async (client) => {
    try {
        // Create an api
        app.use(client.middleware());

        app.get("/messageCollector", (req, res) =>
            handleMessageCollector(req, res, client, sessionUrl)
        );

        app.listen(PORT, function () {
            console.log(`\n• Listening on port ${PORT}!`);
        });

        // Check if all required labels are present in the Whatsapp session
        const sessionLabels = await verifyLabels(client);

        // Register all webhooks
        await registerWebhooks(client, sessionLabels, sessionUrl);

        // Cron to check if cache/chats need to be cleared
    } catch (error) {
        console.error(error);
    }
};

wa.create({
    eventMode: true,
    sessionId,
    sessionDataPath: path.join("session-data"),
    // sessionDataPath: "./whatsapp/sessions/session-data",
    useChrome: true,
}).then((client) => start(client));
