const MenuItem = require("../models/MenuItem.js");

// Fetch all menu items from the db via the 'MenuItems'
const getMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Add a new menu item (for testing)
const addMenuItem = async (req, res) => {
  try {
    const { name, description, price, image } = req.body;
    const newItem = new MenuItem({ name, description, price, image });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: "Error adding item" });
  }
};

// Export the functions
module.exports = { getMenuItems, addMenuItem };
