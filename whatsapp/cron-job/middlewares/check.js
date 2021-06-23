// Dev Only Code
const path = require("path");
require("dotenv").config({ path: path.join(process.cwd(), "/.env") });
// Dev Only Code
const { getProducts, addAlert, updateProductPrice } = require("./db");
const axios = require("axios");

const timer = () => new Promise((resolve) => setTimeout(resolve, 1000));

const checkForPriceDrops = async () => {
    try {
        // Get products from db for price drops
        let today = new Date();
        today.setHours(0, 0, 0, 0);
        const users = await getProducts("price-alert", today);
        if (users.length === 0) {
            return;
        }
        // Handle product according to website domain
        users.forEach((user) => {
            switch (user.products.store_domain) {
                case "amazon.in":
                    // Check Amazon India Price & Send Alert
                    checkAndSendAlertAmazonIn(user);
                    break;
                case "flipkart.com":
                    // Check Flipkart Price & Send Alert
                    checkAndSendAlertFlipkart(user);
                    break;
                default:
                    throw new Error(`Unknown store_domain: ${product.store_domain}`);
            }
        });
        // console.log("done");
    } catch (error) {
        console.error(error);
    }
};

const checkAndSendAlertAmazonIn = async (user) => {
    try {
        const product = user.products;
        const url = process.env.CHECK_AMAZON_IN_URL;
        const reqBody = {
            feedItemTypes: ["Pricing"],
            additionalDataMap: {
                fetchType: "InAppClickToOpen",
                PRICING_FEED_ASIN: product.id,
            },
        };
        const headers = {
            "Content-Encoding": "amz-1.0",
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36",
            "X-Amz-Target": "com.amazon.model.feed.service.FeedService.GetFeedData",
            Cookie: "session-id=23",
            "X-Amz-Ubp-Locale": "IN",
        };
        const response = await axios.post(url, reqBody, {
            headers,
        });
        const productData = JSON.parse(response.data.feedData.feedItems[0].data);
        const currentPrice = productData.productInfos[0].priceHistory.currentPrice.value;
        compareAndHandlePrices(user, currentPrice);
    } catch (error) {
        console.error(error);
    }
};

const checkAndSendAlertFlipkart = async (user) => {
    try {
        const product = user.products;
        const url = process.env.CHECK_FLIPKART;
        const reqBody = {
            pageUri: product.url,
        };
        const headers = {
            "X-User-Agent":
                "Mozilla/5.0 (Linux; Android 5.1; XT1033 Build/LPBS23.13-56-2; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/42.0.2311.138 Mobile Safari/537.36 FKUA/Retail/1230004/Android/Mobile (motorola/XT1033/04ea725d152adfb413e91e0a28505479)",
            "Accept-Encoding": "gzip",
        };
        const productData = await axios.post(url, reqBody, {
            headers,
        });
        const currentPrice =
            productData.data.RESPONSE.pageData.pageContext.pricing.finalPrice.value;
        compareAndHandlePrices(user, currentPrice);
    } catch (error) {
        console.error(error);
    }
};

const compareAndHandlePrices = async (user, currentPrice) => {
    const previousPrice = user.products.price.current;
    if (currentPrice === previousPrice || currentPrice > previousPrice) {
    } else {
        const priceDifference = previousPrice - currentPrice;
        // Update product price in user's doc
        updateProductPrice(user, currentPrice);
        // Schedule an alert for user
        addAlert(user, currentPrice);
    }
};

module.exports = {
    checkForPriceDrops,
};
