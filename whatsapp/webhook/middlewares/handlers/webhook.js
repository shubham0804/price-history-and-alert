const fs = require("fs");
const path = require("path");
const { refactorLabels } = require("../misc");
const { handleNewUser, handleReturningUser } = require("./user");

const handleOnMessage = async (req, res) => {
    try {
        const sessionUrl = fs.readFileSync(
            path.join(process.cwd(), "data", `${req.body.sessionId}-url.txt`),
            // `${process.cwd()}\\data\\${req.body.sessionId}-url.txt`,
            "utf8"
        );
        const sessionLabels = JSON.parse(req.headers.labels);
        const message = req.body.data;
        // console.log(req.body);
        message.sessionUrl = sessionUrl;
        if (!message.isGroupMsg) {
            // Refactor the message labels to display the name instead of ids
            message.labels = refactorLabels(message.chat.labels, sessionLabels);
            // Check if user is new or returning
            const isUserReturning = message.labels.find((label) => label === "returning-user");
            if (!isUserReturning) {
                // Handle New User
                await handleNewUser(message);
            } else {
                // Handle Returning User
                await handleReturningUser(message);
            }
        } else {
            console.error(message);
            throw new Error("Group message recieved");
        }
        res.status(200).send();
    } catch (error) {
        console.error(error);
    }
};

module.exports = {
    handleOnMessage,
};
