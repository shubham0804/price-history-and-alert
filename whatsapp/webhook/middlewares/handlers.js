const fs = require("fs");

const getPriceHistory = require("./data/get-data");
const { checkForUrl, isDomainSupported } = require("./misc");
const {
    sendProductData,
    askToWait,
    errorMessage,
    priceAlertQuery,
} = require("./send-mssg/general");
const { assistantIntro, introVideo } = require("./send-mssg/intro");
const { priceAlert: priceAlertCollector } = require("./send-mssg/collector");
const { supportedDomains } = require("../../../data");

const handleUrl = async (client, userId, url) => {
    // Check if domain is supported
    const domain = isDomainSupported(url);
    if (!domain) {
        // Let user know the current support urls
        const message1 = `Products from this website are currently not supported⚠️.`;
        const message2 = `Websites we currently support are:`;
        const currentlySupportedWebsites = supportedDomains.map(
            (website) => `• *${website.name}*- _${website.domain}_`
        );
        const webstiesList = currentlySupportedWebsites.join("\n");
        const message = `${message1}\n${message2}\n\n${webstiesList}`;
        return {
            error: {
                message,
            },
        };
    } else {
        // Ask user to wait while the data is being fetched
        await askToWait(client, userId);
        // Get Price History
        return await getPriceHistory(domain, url);
    }
};

const handlePotentialUrl = async (client, message) => {
    // Check if message is url & is supported
    const url = checkForUrl(message);
    if (url) {
        // Get price history of the url, if supported
        const product = await handleUrl(client, message.from, url);
        // console.log(product);
        if (!product.error) {
            // Send graph with stats
            await sendProductData(client, message.from, product);
            // Delete graph file
            fs.unlink(product.graphFilePath, (err) => {
                if (err) {
                    throw new Error(err);
                }
            });
            // Price alert & collector
            await priceAlertQuery(client, message.from, product.dropChances);
            await priceAlertCollector(client, message.from, product);
        } else {
            // Send error message
            await errorMessage(client, message.from, product.error.message);
        }
    } else {
        // Send url Video with caption asking to share product
        await introVideo(client, message.from);
    }
};

// module.exports = {
//     handleMessageCollector,
// };
