const axios = require("axios");

const addLabel = async (sessionUrl, userId, label) => {
    try {
        const url = sessionUrl.concat("/addLabel");
        const add = await axios.post(url, {
            args: [label, userId],
        });
        if (add.data.response) {
            return;
        } else {
            throw new Error(`Error while adding label: ${label} to user: ${userId} `);
        }
    } catch (error) {
        throw new Error(error.response.data);
    }
};

const removeLabel = async (sessionUrl, userId, label) => {
    try {
        const url = sessionUrl.concat("/removeLabel");
        const remove = await axios.post(url, {
            args: [label, userId],
        });
        if (remove.data.response) {
            return;
        } else {
            throw new Error(`Error while removeing label: ${label} to user: ${userId} `);
        }
    } catch (error) {
        throw new Error(error.response.data);
    }
};

module.exports = {
    addLabel,
    removeLabel,
};
