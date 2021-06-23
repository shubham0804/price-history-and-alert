require("../../config/db");
var cron = require("node-cron");
const { checkForPriceDrops } = require("./middlewares/check");

// Price Drop & Stock Alert
// cron.schedule("* * * * *", () => {
checkForPriceDrops();

// checkForStockAlerts();
// });
