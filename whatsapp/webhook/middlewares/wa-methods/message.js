const axios = require("axios");

const simulateTyping = async (sessionUrl, userId) => {
    try {
        const url = sessionUrl.concat("/simulateTyping");
        const timer = (time) =>
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve();
                }, time * 1000);
            });
        const randomTime = Math.floor(Math.random() * (4 - 2 + 1)) + 2;
        await axios.post(url, { args: [userId, true] });
        await timer(randomTime);
        await axios.post(url, { args: [userId, false] });
        return;
    } catch (error) {
        throw new Error(error);
    }
};

const sendText = async (sessionUrl, userId, text) => {
    try {
        // Dev Only
        await simulateTyping(sessionUrl, userId);
        const url = sessionUrl.concat("/sendText");
        const send = await axios.post(url, {
            args: [userId, text],
        });
        if (send.data.response) {
            return;
        } else {
            throw new Error(`Error while sending text: ${text} to user: ${userId} `);
        }
    } catch (error) {
        throw new Error(error);
    }
};

const sendFile = async (sessionUrl, userId, { filePath, fileName, caption }) => {
    try {
        // Dev Only
        await simulateTyping(sessionUrl, userId);
        const url = sessionUrl.concat("/sendFile");
        const send = await axios.post(url, {
            args: [userId, filePath, fileName, caption],
        });
        if (send.data.response) {
            return;
        } else {
            throw new Error(`Error while sending text: ${text} to user: ${userId} `);
        }
    } catch (error) {
        throw new Error(error);
    }
};

const sendImage = async (sessionUrl, userId, { filePath, fileName, caption }) => {
    try {
        // Dev Only
        await simulateTyping(sessionUrl, userId);
        const url = sessionUrl.concat("/sendImage");
        const send = await axios.post(url, {
            args: [userId, filePath, fileName, caption],
        });
        if (send.data.response) {
            return;
        } else {
            console.error(`sessionUrl: ${sessionUrl}`);
            console.error(`cation: ${caption}`);
            throw new Error(`Error while sending image to user: ${userId} `);
        }
    } catch (error) {
        throw new Error(error);
    }
};

module.exports = {
    simulateTyping,
    sendText,
    sendFile,
    sendImage,
};
