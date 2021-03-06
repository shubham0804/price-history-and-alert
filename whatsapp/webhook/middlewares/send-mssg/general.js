const { sendText, sendImage } = require("../wa-methods/message");

const sendProductData = async (sessionUrl, userId, productHistory) => {
    // console.log(productHistory);
    const productTitle =
        productHistory.title.length <= 30
            ? `*${productHistory.title}*`
            : `*${productHistory.title.substr(0, 27)}...*`;
    const currentPrice =
        productHistory.currentPrice !== "0" && `ðª Current Price: *â¹${productHistory.currentPrice}*`;

    // console.log(typeof productHistory.lowestPrice);
    const lowestPrice =
        productHistory.lowestPrice !== "0" && `ð½ Lowest Price: *â¹${productHistory.lowestPrice}*`;
    const highestPrice = `ð¼ Highest Price: *â¹${productHistory.highestPrice}*`;
    const dropChances = `ð Price Drop Chances: *${productHistory.dropChances}*%`;
    if (lowestPrice && currentPrice) {
        var imageCaption = `${productTitle}\n${currentPrice}\n${highestPrice}\n${lowestPrice}\n${dropChances}`;
    } else if (!lowestPrice && currentPrice) {
        var imageCaption = `${productTitle}\n${currentPrice}\n${highestPrice}\n${dropChances}`;
    } else if (lowestPrice && !currentPrice) {
        var imageCaption = `${productTitle}\n${highestPrice}\n${lowestPrice}\n${dropChances}`;
    }
    const graphFilePath = productHistory.graphFilePath;
    const send = sendImage(sessionUrl, userId, {
        filePath: graphFilePath,
        fileName: "Price Graph",
        caption: imageCaption,
    });
    return send;
};

const askToWait = async (sessionUrl, userId) => {
    const text = `Please wait while I get the product dataâ³`;
    await sendText(sessionUrl, userId, text);
};

const errorMessage = async (sessionUrl, userId, errorMssg) => {
    const mssg = `Uh-ohâ${errorMssg}`;
    await sendText(sessionUrl, userId, mssg);
};

const priceAlertQuery = async (sessionUrl, userId, priceDropChances) => {
    const priceDropMssg = `There is a *high* chance of price dropping in the future ð`;
    const notificationMssg = `Would you like to recieve an alert if the price drops?ð`;
    const yesNoMssg = `_Send *Yes* or *No*_`;
    const finalMssg = `${notificationMssg}\n${yesNoMssg}`;
    if (priceDropChances >= 50) {
        await sendText(sessionUrl, userId, priceDropMssg);
    }
    await sendText(sessionUrl, userId, finalMssg);
};

module.exports = {
    sendProductData,
    askToWait,
    errorMessage,
    priceAlertQuery,
};
