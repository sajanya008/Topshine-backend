// const express = require("express");
// const router = express.Router();
// const Service = require("../models/Service");
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// // ✅ Ensure uploads folder exists
// if (!fs.existsSync("uploads")) {
//   fs.mkdirSync("uploads");
// }

// // ✅ Multer Storage Setup
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// const upload = multer({ storage });

// // ✅ ADD SERVICE
// router.post("/add", upload.single("image"), async (req, res) => {
//   try {
//     console.log(req.body);
//     console.log(req.file);

//     if (!req.file) {
//       return res.status(400).json({ message: "Image is required" });
//     }

//     const newService = new Service({
//       title: req.body.title,
//       description: req.body.description,
//       image: req.file.filename,
//     });

//     await newService.save();

//     res.status(201).json({ message: "Service Added Successfully" });

//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: error.message });
//   }
// });

// // ✅ GET ALL SERVICES
// router.get("/", async (req, res) => {
//   try {
//     const services = await Service.find();
//     res.json(services);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // ✅ DELETE SERVICE
// router.delete("/:id", async (req, res) => {
//   try {
//     const service = await Service.findById(req.params.id);

//     if (!service) {
//       return res.status(404).json({ message: "Service not found" });
//     }

//     // Optional: delete image file also
  
//     const imagePath = `uploads/${service.image}`;

//     if (fs.existsSync(imagePath)) {
//       fs.unlinkSync(imagePath);
//     }

//     await Service.findByIdAndDelete(req.params.id);

//     res.json({ message: "Service Deleted Successfully" });

//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: error.message });
//   }
// });

// router.get("/:id", async (req, res) => {
//   try {
//     const service = await Service.findById(req.params.id);
//     res.json(service);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// router.put("/:id", upload.single("image"), async (req, res) => {
//   try {
//     const service = await Service.findById(req.params.id);

//     if (!service) {
//       return res.status(404).json({ message: "Service not found" });
//     }

//     // Update text fields
//     service.title = req.body.title;
//     service.description = req.body.description;

//     // If new image uploaded
//     if (req.file) {
//       const fs = require("fs");

//       const oldImagePath = `uploads/${service.image}`;
//       if (fs.existsSync(oldImagePath)) {
//         fs.unlinkSync(oldImagePath);
//       }

//       service.image = req.file.filename;
//     }

//     await service.save();

//     res.json({ message: "Service Updated Successfully" });

//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: error.message });
//   }
// });

// module.exports = router;



const express = require("express");
const router = express.Router();
const Service = require("../models/Service");

// ✅ Cloudinary middleware
const upload = require("../middleware/upload");


// ✅ ADD SERVICE
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const newService = new Service({
      title: req.body.title,
      description: req.body.description,
      image: req.file.path, // ✅ Cloudinary URL
    });

    await newService.save();

    res.status(201).json({ message: "Service Added Successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ✅ GET ALL
router.get("/", async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ✅ GET SINGLE
router.get("/:id", async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ✅ UPDATE
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    service.title = req.body.title;
    service.description = req.body.description;

    // ✅ new image upload
    if (req.file) {
      service.image = req.file.path; // Cloudinary URL
    }

    await service.save();

    res.json({ message: "Service Updated Successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ✅ DELETE
router.delete("/:id", async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    await Service.findByIdAndDelete(req.params.id);

    res.json({ message: "Service Deleted Successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;