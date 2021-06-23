const { webhooksToRegister, labels: masterLabels } = require("../../../data");

const verifyLabels = async (client) => {
    let sessionLabels = await client.getAllLabels();
    // console.log(sessionLabels);
    for (masterLabel of masterLabels) {
        const check = sessionLabels.find((sessionLabel) => sessionLabel.name === masterLabel.name);
        if (!check) {
            throw new Error(`Label: ${masterLabel.name} not found in Whatsapp. Add it to proceed!`);
        }
    }
    sessionLabels = sessionLabels.map((label) => ({ id: label.id, name: label.name }));
    // Stringify the labels to add to the header
    sessionLabels = JSON.stringify(sessionLabels);
    return sessionLabels;
};

const registerWebhooks = async (client, stringifiedLabels, sessionUrl) => {
    // Register Webhooks
    for (webhook of webhooksToRegister) {
        const setWebhook = await client.registerWebhook(webhook.url, webhook.listeners, {
            headers: {
                labels: stringifiedLabels,
                sessionurl: sessionUrl,
            },
        });
        if (!setWebhook) {
            throw new Error(`Webhook: ${webhook} not set successfully. Re-check the webhooksToSet`);
        }
    }
    // Re-confirm if all the webhooks have been set
    const checkWebhooks = await client.listWebhooks();
    if (checkWebhooks.length === webhooksToRegister.length) {
        return;
    } else {
        throw new Error("No. of webhooks to register !== No. of Webhooks registered. Check code");
    }
};

module.exports = {
    verifyLabels,
    registerWebhooks,
};
