const fs = require("fs");
const { checkForUrl, isDomainSupported } = require("../misc");
const { introVideo } = require("../send-mssg/intro");
const {
    askToWait,
    sendProductData,
    priceAlertQuery,
    errorMessage,
} = require("../send-mssg/general");
const getPriceHistory = require("../data/get-data");
const { supportedDomains } = require("../../../../data");
const { createAlertCollector } = require("../send-mssg/collector");

const handlePotentialUrl = async (message) => {
    // Check if message is url & is supported
    const url = checkForUrl(message);
    if (url) {
        // Get price history of the url, if supported
        const product = await handleUrl(message.sessionUrl, message.from, url);
        if (!product.error) {
            // Send graph with stats
            await sendProductData(message.sessionUrl, message.from, product);
            // Delete graph file
            fs.unlink(product.graphFilePath, (err) => {
                if (err) {
                    throw new Error(err);
                }
            });
            // Price alert & collector
            await priceAlertQuery(message.sessionUrl, message.from, product.dropChances);
            await createAlertCollector(message.sessionUrl, message.from, product);
        } else {
            // Send error message
            await errorMessage(message.sessionUrl, message.from, product.error.text);
        }
    } else {
        // Send url Video with caption asking to share product
        await introVideo(message.sessionUrl, message.from);
    }
};

const handleUrl = async (sessionUrl, userId, url) => {
    // Check if domain is supported
    const domain = isDomainSupported(url);

    if (!domain) {
        // If domain is not supported, let user know the current support urls
        const text1 = `Products from this website are currently not supported⚠️.`;
        const text2 = `Websites we currently support are:`;
        const currentlySupportedWebsites = supportedDomains.map(
            (website) => `• *${website.name}*- _${website.domain}_`
        );
        const webstiesList = currentlySupportedWebsites.join("\n");
        const text = `${text1}\n${text2}\n\n${webstiesList}`;
        return {
            error: {
                text,
            },
        };
    } else {
        // Ask user to wait while the data is being fetched
        askToWait(sessionUrl, userId);
        // Get Price History
        return await getPriceHistory(domain, url);
    }
};

module.exports = {
    handlePotentialUrl,
};
