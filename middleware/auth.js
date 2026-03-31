const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

async function verifyAdmin(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await Admin.findById(decoded.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    // check sessionId
    if (admin.sessionId !== decoded.sessionId)
      return res.status(401).json({ message: "Session expired. Please login again." });

    req.admin = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = verifyAdmin;