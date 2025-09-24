const express = require("express");
const Farmer = require("../models/user");

const router = express.Router();

// ✅ Register a farmer
router.post("/register", async (req, res) => {
  try {
    const farmer = new Farmer(req.body);
    await farmer.save();
    res.status(201).json({ message: "Farmer registered successfully", farmer });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// ✅ Get all farmers
router.get("/", async (req, res) => {
  try {
    const farmers = await Farmer.find();
    res.json(farmers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch farmers" });
  }
});

module.exports = router;
