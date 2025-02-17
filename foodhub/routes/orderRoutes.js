const express = require("express");
const { placeOrder, checkOrderStatus } = require("../controllers/orderController");

const router = express.Router();

router.post("/order", placeOrder);
router.get("/status/:orderId", checkOrderStatus);

module.exports = router;

