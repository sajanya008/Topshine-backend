const express = require("express");
const router = express.Router();
const Package = require("../models/Package");

// Add Package
router.post("/add", async (req, res) => {
  try {
    const { title, duration, price, description } = req.body;

    const newPackage = new Package({
      title,
      duration,
      price,
      description,
      icon: req.body.icon || "default-icon", // 
    });

    await newPackage.save();

    res.status(201).json({
      success: true,
      message: "Package added successfully",
      data: newPackage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});




// Get All Packages
router.get("/all", async (req, res) => {
  try {
    const packages = await Package.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: packages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    await Package.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Package deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get Single Package
router.get("/:id", async (req, res) => {
  try {
    const packageData = await Package.findById(req.params.id);

    res.status(200).json({
      success: true,
      data: packageData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


// Update Package
router.put("/update/:id", async (req, res) => {
  try {
    console.log(req.body); // 🔥 Debug line

    const { title, duration, price, description, icon } = req.body;

    const updatedPackage = await Package.findByIdAndUpdate(
      req.params.id,
      {
        title,
        duration,
        price,
        description,
        icon,   // ✅ THIS LINE IS VERY IMPORTANT
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Package updated successfully",
      data: updatedPackage,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;