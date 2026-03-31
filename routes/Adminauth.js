const router = require("express").Router();
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const admin = await Admin.findOne({ email: req.body.email });
    if (!admin) return res.status(400).json({ message: "Admin not found" });

    const validPassword = await bcrypt.compare(req.body.password, admin.password);
    if (!validPassword) return res.status(400).json({ message: "Wrong password" });

    // create unique sessionId
    const sessionId = crypto.randomBytes(16).toString("hex");
    admin.sessionId = sessionId;
    await admin.save();

    const token = jwt.sign(
      { id: admin._id, role: "admin", sessionId },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// LOGOUT
router.post("/logout", async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    admin.sessionId = null; // clear session
    await admin.save();

    res.json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

module.exports = router;