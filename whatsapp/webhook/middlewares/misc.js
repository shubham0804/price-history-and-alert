const getUrls = require("get-urls");
const { parse } = require("tldts");
const { supportedDomains: websites } = require("../../../data");
const { getUser, addAlertToDb } = require("./db");
const { errorMessage: sendErrorMessage } = require("./send-mssg/general");

const checkForUrl = (message) => {
    if (message.type === "chat" || message.type === "image") {
        const potentialUrls = message.type === "chat" ? message.body : message.caption;
        const url = getUrls(potentialUrls);
        return url.size === 0 ? false : url.values().next().value;
    } else {
        console.log("Message is not a chat or image");
        return false;
    }
};

const isDomainSupported = (url) => {
    // Get Domain of url
    const domain = parse(url).domain;
    // Check if domain is supported
    supportedDomains = websites.map((website) => website.domain);
    return supportedDomains.includes(domain) ? domain : false;
};

const refactorLabels = (messageLabels, sessionLabels) => {
    const refactoredLabels = messageLabels.map((messageLabelId) => {
        const findLabel = sessionLabels.find((sessionLabel) => sessionLabel.id === messageLabelId);
        return findLabel.name;
    });
    return refactoredLabels;
};

const checkAndAddAlert = async (client, userId, hostId, product) => {
    // console.log(product);
    const user = await getUser(userId, hostId);
    const noOfProducts = user.products.length;
    const isDuplicate = user.products.find((userProduct) => userProduct.id === product.id);
    const maxAllowedAlerts = 30;
    // Check if the user is currently tracking > or < 30 products
    if (!isDuplicate && noOfProducts < maxAllowedAlerts) {
        // Add Alert
        const add = await addAlertToDb(user, product);
        return true;
    } else if (noOfProducts >= maxAllowedAlerts) {
        // Send max alerts error message
        const errorText = `Uh-oh❗ A maximum of ${maxAllowedAlerts} alerts can be created at a time. Please try again later🕑`;
        await client.sendText(userId, errorText);
        return false;
    } else if (isDuplicate) {
        // Send duplicate alert error messageductTitle = `_${product.title.substr(0, 27)}..._`;
        const errorText = `Uh-oh❗This product is already being tracked. I'll let you know if the price drops`;
        await client.sendText(userId, errorText);
        return false;
    }
};

module.exports = {
    checkForUrl,
    checkAndAddAlert,
    isDomainSupported,
    refactorLabels,
};
