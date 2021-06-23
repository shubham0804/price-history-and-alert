const path = require("path");
require(path.join(process.cwd(), "/.config/db"));
// require("../../../config/db");
const User = require("../../../models/user");

const getProducts = async (alertType, monitorEndDate) => {
    // Check for errors in fnc params
    if (!(alertType === "price-alert" || alertType === "stock-alert")) {
        throw new Error(`Unknown alert type: ${alertType}`);
    }
    if (!(monitorEndDate instanceof Date && monitorEndDate.getDate())) {
        throw new Error(`Unknown monitor_end_date type:${monitorEndDate}`);
    }
    // Get products
    const products = await User.aggregate([
        { $unwind: "$products" },
        {
            $match: {
                "products.monitor_end_date": { $gte: monitorEndDate },
                "products.alert_type": alertType,
            },
        },
    ]);
    return products;
};

const addAlert = async (user, currentPrice) => {};

const updateProductPrice = async (user, currentPrice) => {
    await User.findOneAndUpdate(
        {
            _id: user._id,
            "products.id": user.products.id,
        },
        {
            $set: { "products.$.price.current": currentPrice },
        }
    );
    return true;
};

module.exports = {
    getProducts,
    addAlert,
    updateProductPrice,
};
