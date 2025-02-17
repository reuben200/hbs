const Order = require("../models/Order.js");
const MenuItem = require("../models/MenuItem.js");
const mongoose = require("mongoose");

// Place an order
const placeOrder = async (req, res) => {
  try {
    const { customerName, address, items } = req.body;

    // Ensure `items` is an array
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).render("order", { message: "🚫 No items selected!" });
    }

    // Fetch full details of ordered items
    const orderedItems = await MenuItem.find({ _id: { $in: items } }).lean();

    // Calculate total price (ensure it’s a number)
    let totalAmount = orderedItems.reduce((sum, item) => sum + Number(item.price), 0);
    totalAmount = mongoose.Types.Decimal128.fromString(String(totalAmount.toFixed(2)));

    // Create a new order
    const newOrder = new Order({ customerName, address, items, totalAmount });
    await newOrder.save();

    // Redirect to receipt page
    res.redirect(`/receipt/${newOrder._id}`);
  } catch (error) {
    console.error("❌ Error placing order:", error);
    res.status(500).render("order", { message: "🚫 Failed to place order" });
  }
};


// Check order status
const checkOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate("items").lean();
    if (!order) {
      return res.status(404).render("status", { message: "🚫 Order not found" });
    }

    res.render("status", { order });
  } catch (error) {
    console.error("Error retrieving order:", error);
    res.status(500).render("status", { message: "🚫 Error retrieving order" });
  }
};

// ✅ Export functions properly
module.exports = { placeOrder, checkOrderStatus };
