// const express = require("express");
// const router = express.Router();
// const Expert = require("../models/Expert");
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// //  Ensure uploads/expert folder exists
// if (!fs.existsSync("uploads/experts")) {
//   fs.mkdirSync("uploads/experts", { recursive: true });
// }

// //  Multer Storage Setup
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/experts/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// const upload = multer({ storage });


// //  ADD EXPERT
// router.post("/add", upload.single("image"), async (req, res) => {
//   try {
//     console.log(req.body);
//     console.log(req.file);

//     if (!req.file) {
//       return res.status(400).json({ message: "Image is required" });
//     }

//     const newExpert = new Expert({
//       name: req.body.name,
//       designation: req.body.designation,
//       country: req.body.country,
//       image: req.file.filename,
//     });

//     await newExpert.save();

//     res.status(201).json({ message: "Expert Added Successfully" });

//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: error.message });
//   }
// });


// // GET ALL EXPERTS
// router.get("/", async (req, res) => {
//   try {
//     const experts = await Expert.find();
//     res.json(experts);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });


// // GET SINGLE EXPERT
// router.get("/:id", async (req, res) => {
//   try {
//     const expert = await Expert.findById(req.params.id);
//     res.json(expert);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });


// //  UPDATE EXPERT
// router.put("/:id", upload.single("image"), async (req, res) => {
//   try {
//     const expert = await Expert.findById(req.params.id);

//     if (!expert) {
//       return res.status(404).json({ message: "Expert not found" });
//     }

//     // Update text fields
//     expert.name = req.body.name;
//     expert.designation = req.body.designation;
//     expert.country = req.body.country;

//     // If new image uploaded
//     if (req.file) {
//       const oldImagePath = `uploads/experts/${expert.image}`;

//       if (fs.existsSync(oldImagePath)) {
//         fs.unlinkSync(oldImagePath);
//       }

//       expert.image = req.file.filename;
//     }

//     await expert.save();

//     res.json({ message: "Expert Updated Successfully" });

//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: error.message });
//   }
// });


// //  DELETE EXPERT
// router.delete("/:id", async (req, res) => {
//   try {
//     const expert = await Expert.findById(req.params.id);

//     if (!expert) {
//       return res.status(404).json({ message: "Expert not found" });
//     }

//     const imagePath = `uploads/experts/${expert.image}`;

//     if (fs.existsSync(imagePath)) {
//       fs.unlinkSync(imagePath);
//     }

//     await Expert.findByIdAndDelete(req.params.id);

//     res.json({ message: "Expert Deleted Successfully" });

//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: error.message });
//   }
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const Expert = require("../models/Expert");

// ✅ Cloudinary upload middleware
const upload = require("../middleware/upload");


// ✅ ADD EXPERT
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const newExpert = new Expert({
      name: req.body.name,
      designation: req.body.designation,
      country: req.body.country,
      image: req.file.path, // ✅ Cloudinary URL
    });

    await newExpert.save();

    res.status(201).json({ message: "Expert Added Successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});


// ✅ GET ALL
router.get("/", async (req, res) => {
  try {
    const experts = await Expert.find();
    res.json(experts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ✅ GET SINGLE
router.get("/:id", async (req, res) => {
  try {
    const expert = await Expert.findById(req.params.id);
    res.json(expert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ✅ UPDATE
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const expert = await Expert.findById(req.params.id);

    if (!expert) {
      return res.status(404).json({ message: "Expert not found" });
    }

    expert.name = req.body.name;
    expert.designation = req.body.designation;
    expert.country = req.body.country;

    // ✅ new image upload
    if (req.file) {
      expert.image = req.file.path; // Cloudinary URL
    }

    await expert.save();

    res.json({ message: "Expert Updated Successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});


// ✅ DELETE
router.delete("/:id", async (req, res) => {
  try {
    const expert = await Expert.findById(req.params.id);

    if (!expert) {
      return res.status(404).json({ message: "Expert not found" });
    }

    await Expert.findByIdAndDelete(req.params.id);

    res.json({ message: "Expert Deleted Successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;