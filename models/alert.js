const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
    channel: {
        type: String,
        enum: ["whatsapp"],
        required: true,
    },
    user_id: {
        type: String,
        required: true,
        // unique: true,
    },
    host_id: {
        type: String,
        required: function () {
            return this.channel === "whatsapp";
        },
    },
    product: productSchema,
});

const alertModel = mongoose.model("Alert", alertSchema);

module.exports = alertModel;
