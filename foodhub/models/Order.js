const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    address: { type: String, required: true },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: "MenuItem" }],
    totalAmount: { type: mongoose.Types.Decimal128, required: true, default: 0 },
    status: { type: String, enum: ["READY", "IN TRANSIT", "DELIVERED"], default: "READY" },
    createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
