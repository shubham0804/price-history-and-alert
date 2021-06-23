// Dev Only
// require("../config/db");
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
        store_domain: {
            type: String,
            enum: ["amazon.in", "flipkart.com"],
            required: true,
        },
        price: {
            currency: {
                type: String,
                enum: ["INR"],
                required: true,
            },
            current: {
                type: Number,
                required: function () {
                    return this.alertType === "price-alert";
                },
            },
        },
        alert_type: {
            type: String,
            enum: ["price-alert", "stock-alert"],
            required: true,
        },
        monitor_end_date: {
            type: Date,
            required: true,
        },
    },
    {
        _id: false,
        // Production
        // autoIndex: false
    }
);

const userSchema = new mongoose.Schema(
    {
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
        name: String,
        phone_number: {
            type: String,
            // Set from user_id, if channel is whatsapp
        },
        products: [productSchema],
    },
    {
        // In Production
        // autoIndex: false
    }
);

userSchema.index({ user_id: 1, host_id: 1 }, { unique: true });
productSchema.index({ monitor_end_date: 1 });

const User = mongoose.model("User", userSchema);

module.exports = User;
