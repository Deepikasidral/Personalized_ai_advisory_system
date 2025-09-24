const mongoose = require("mongoose");

const farmerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  address: { type: String, required: true },
  crop: { type: String, required: true },
  experience: { type: Number, required: true }
});

module.exports = mongoose.model("Farmer", farmerSchema);
