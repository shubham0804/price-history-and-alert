const { checkAndAddAlert, checkForUrl } = require("../../webhook/middlewares/misc");
const { handlePotentialUrl } = require("../../webhook/middlewares/handlers/url");
const { sendAffiliateLink } = require("./affiliate-link");

const handleMessageCollector = async (req, res, client, sessionUrl) => {
    if (req.body.userId && req.body.options && req.body.collectorType && req.body.product) {
        const filter = () => true;
        const collector = client.createMessageCollector(req.body.userId, filter, req.body.options);
        // Create collector emitter acc to it's type
        switch (req.body.collectorType) {
            case "create-alert":
                await handleCreateAlert(
                    client,
                    collector,
                    req.body.userId,
                    sessionUrl,
                    req.body.product
                );
                break;
            case "renew-alert":
                break;
            default:
                throw new Error(`Unkown collector type: ${req.body.collectorType}`);
        }
        res.status(200).send();
    } else {
        res.status(422).send();
    }
};

const handleCreateAlert = async (client, collector, userId, sessionUrl, product) => {
    // Add collector-alert label to contact
    await client.addLabel("collector-alert", userId);

    collector.on("collect", async (message) => {
        switch (message.body.toLowerCase()) {
            case "yes":
                // Check & add alert to user's doc
                const addAlert = await checkAndAddAlert(client, message.from, message.to, product);
                collector.stop();
                if (addAlert) {
                    // Send confirmation message
                    const text1 = `Great👍 I'll let you know if the price drops`;
                    await client.sendText(message.from, text1);
                    // Send affiliate link
                    await sendAffiliateLink(client, userId, product);
                }
                break;
            case "no":
                // Send affiliate link
                await sendAffiliateLink(client, userId, product);
                collector.stop();
                // Send affiliate link
                // await sendAffiliateLink(client, userId, product);
                break;
            default:
                // Check if message is url, if yes, handle url
                const isUrl = await checkForUrl(message);
                if (!isUrl) {
                    const text = "_Please reply with a *Yes* or *No*_";
                    await client.sendText(userId, text);
                } else {
                    message.sessionUrl = sessionUrl;
                    collector.stop();
                    await handlePotentialUrl(message);
                }
                break;
        }
    });

    collector.on("end", async (collected, reason) => {
        // Possible reasons are: limit,time,user?
        // console.log(reason);
        // Remove collector-alert label to contact
        await client.removeLabel("collector-alert", userId);
        if (reason === "time" || reason === "limit") {
            const text = `Alert has not been created 🔕\nPlease share the product again to create an alert`;
            await client.sendText(userId, text);
        }
    });
};

module.exports = {
    handleMessageCollector,
};
