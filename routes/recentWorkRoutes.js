const express = require("express");
const router = express.Router();
const RecentWork = require("../models/RecentWork");

// ✅ Cloudinary middleware
const upload = require("../middleware/upload");


// ✅ ADD RECENT WORK
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const newWork = new RecentWork({
      name: req.body.name,
      description: req.body.description,
      image: req.file.path, // ✅ Cloudinary URL
    });

    await newWork.save();

    res.status(201).json({ message: "Recent Work Added Successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ✅ GET ALL
router.get("/", async (req, res) => {
  try {
    const works = await RecentWork.find().sort({ createdAt: -1 });
    res.json(works);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ✅ GET SINGLE
router.get("/:id", async (req, res) => {
  try {
    const work = await RecentWork.findById(req.params.id);
    res.json(work);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ✅ UPDATE
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const work = await RecentWork.findById(req.params.id);

    if (!work) {
      return res.status(404).json({ message: "Recent Work not found" });
    }

    work.name = req.body.name;
    work.description = req.body.description;

    // ✅ new image upload
    if (req.file) {
      work.image = req.file.path; // Cloudinary URL
    }

    await work.save();

    res.json({ message: "Recent Work Updated Successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ✅ DELETE
router.delete("/:id", async (req, res) => {
  try {
    const work = await RecentWork.findById(req.params.id);

    if (!work) {
      return res.status(404).json({ message: "Recent Work not found" });
    }

    await RecentWork.findByIdAndDelete(req.params.id);

    res.json({ message: "Recent Work Deleted Successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;