const User = require("../../../models/user");
const currency = require("currency.js");

const getUser = async (userId, hostId) => {
    const user = await User.findOne({ user_id: userId, host_id: hostId });
    if (user) {
        return user;
    } else {
        throw new Error(`user_id: ${userId} with host_id: ${hostId} not found in db`);
    }
};

const addUser = async (channel, ...data) => {
    switch (channel) {
        case "whatsapp":
            [message] = data;
            var user_id = message.from;
            var host_id = message.to;
            var name = message.sender.pushname;
            break;
        default:
            throw new Error("Unknown Channel type", channel);
    }

    await User.create({
        channel,
        user_id,
        host_id,
        name,
    });
    // console.log("user added");
};

const addAlertToDb = async (user, product) => {
    const dateNow = new Date();
    const monitorEndDate = new Date(dateNow.setMonth(dateNow.getMonth() + 1));
    if (typeof product.currentPrice === "string") {
        var price = currency(product.currentPrice).value;
    } else {
        var price = product.currentPrice;
    }
    const productToAdd = {
        id: product.id,
        image: product.image,
        title: product.title,
        url: product.originalUrl,
        store_domain: product.storeDomain,
        price: {
            currency: "INR",
            current: price,
        },
        alert_type: "price-alert",
        monitor_end_date: monitorEndDate,
    };
    user.products.push(productToAdd);
    await user.save();
};

module.exports = {
    getUser,
    addUser,
    addAlertToDb,
};
