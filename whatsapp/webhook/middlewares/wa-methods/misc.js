// Created using the wa-session i.e has access to client
const createMessageCollector = (client, userId, filter, options) => {
    try {
        const collector = client.createMessageCollector(userId, filter, options);
        return collector;
    } catch (error) {
        throw new Error(error);
    }
};

module.exports = {
    createMessageCollector,
};
