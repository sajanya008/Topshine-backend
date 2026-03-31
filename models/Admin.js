
const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  sessionId: { type: String, default: null }, // session tracking
});

module.exports = mongoose.model("Admin", adminSchema);