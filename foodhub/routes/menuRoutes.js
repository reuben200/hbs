const express = require("express");
const { getMenuItems, addMenuItem } = require("../controllers/menuController");

const router = express.Router();

router.get("/", getMenuItems);
router.post("/add", addMenuItem); // For testing

module.exports = router;