const { getUser, addUser } = require("../db");
const { addLabel } = require("../wa-methods/labels");
const { assistantIntro, introVideo } = require("../send-mssg/intro");
const { handlePotentialUrl } = require("./url");

const handleNewUser = async (message) => {
    // Add User to db
    await addUser("whatsapp", message);
    // Add returning-user label
    await addLabel(message.sessionUrl, message.from, "returning-user");
    // Send assistant intro message
    await assistantIntro(message.sessionUrl, message);
    // Send url Video with caption asking to share product
    await introVideo(message.sessionUrl, message.from);
};

const handleReturningUser = async (message) => {
    // Check if a collector is active
    const isCollectorActive = message.labels.find((label) => label.includes("collector"));
    if (!isCollectorActive) {
        await handlePotentialUrl(message);
    } else {
        console.log("collector active:", isCollectorActive);
    }
};

module.exports = {
    handleNewUser,
    handleReturningUser,
};
