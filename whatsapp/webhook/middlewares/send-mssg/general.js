const { sendText, sendImage } = require("../wa-methods/message");

const sendProductData = async (sessionUrl, userId, productHistory) => {
    // console.log(productHistory);
    const productTitle =
        productHistory.title.length <= 30
            ? `*${productHistory.title}*`
            : `*${productHistory.title.substr(0, 27)}...*`;
    const currentPrice =
        productHistory.currentPrice !== "0" && `🪙 Current Price: *₹${productHistory.currentPrice}*`;

    // console.log(typeof productHistory.lowestPrice);
    const lowestPrice =
        productHistory.lowestPrice !== "0" && `🔽 Lowest Price: *₹${productHistory.lowestPrice}*`;
    const highestPrice = `🔼 Highest Price: *₹${productHistory.highestPrice}*`;
    const dropChances = `📉 Price Drop Chances: *${productHistory.dropChances}*%`;
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
    const text = `Please wait while I get the product data⏳`;
    await sendText(sessionUrl, userId, text);
};

const errorMessage = async (sessionUrl, userId, errorMssg) => {
    const mssg = `Uh-oh❗${errorMssg}`;
    await sendText(sessionUrl, userId, mssg);
};

const priceAlertQuery = async (sessionUrl, userId, priceDropChances) => {
    const priceDropMssg = `There is a *high* chance of price dropping in the future 📉`;
    const notificationMssg = `Would you like to recieve an alert if the price drops?🔔`;
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
