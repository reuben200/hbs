const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { engine } = require("express-handlebars");
const path = require("path");
const connectDB = require("./config/db");
const menuRoutes = require("./routes/menuRoutes");
const orderRoutes = require("./routes/orderRoutes");
const MenuItem = require("./models/MenuItem");
const Order = require("./models/Order");

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set Handlebars as the view engine
app.engine("hbs", engine({ extname: ".hbs" }));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

// Serve Static Files (CSS, Images, etc.)
app.use(express.static(path.join(__dirname, "public")));

// API Routes
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);

// Renders the Welcome page
app.get("/", (req, res) => {
  res.render("welcome", { layout: "welcomeLayout" }); 
});

// Menu Route (Renders the Menu)
app.get("/menu", async (req, res) => {
  try {
    const menuItems = await MenuItem.find().lean();
    const categories = [...new Set(menuItems.map(item => item.category))];

    res.render("menu", { menu: menuItems, categories });
  } catch (error) {
    console.error("Error loading menu:", error);
    res.status(500).send("Error loading menu");
  }
});

// Order Page Route
app.get("/order", async (req, res) => {
  try {
    const menuItems = await MenuItem.find().lean();
    res.render("order", { menu: menuItems });
  } catch (error) {
    console.error("Error loading order page:", error);
    res.status(500).send("Error loading order page");
  }
});

// Order Status Page Route
app.get("/status", (req, res) => {
  res.render("status");
});

// Handle Order Status Request
app.post("/status", async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId).lean();

    if (!order) {
      return res.render("status", { message: "🚫 Order not found" });
    }

    res.render("status", { status: order.status });
  } catch (error) {
    console.error("Error retrieving order:", error);
    res.status(500).render("status", { message: "🚫 Error retrieving order" });
  }
});

// Order Receipt Route
app.get("/receipt/:orderId", async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).populate("items").lean();

    if (!order) {
      return res.render("receipt", { message: "🚫 Order not found" });
    }

    // Convert `totalAmount` from Decimal128 to a readable format
    if (order.totalAmount) {
      order.totalAmount = order.totalAmount.toString();
    }

    console.log("Order Details:", order); // ✅ Debugging: See full order data

    res.render("receipt", { order, items: order.items, totalAmount: order.totalAmount });
  } catch (error) {
    console.error("Error loading receipt:", error);
    res.status(500).render("receipt", { message: "🚫 Error retrieving order details" });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🟢 Server running on http://localhost:${PORT}`));
