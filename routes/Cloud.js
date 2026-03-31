// const express = require("express");
// const router = express.Router();
// const upload = require("../middleware/upload");

// router.post("/add", upload.single("image"), (req, res) => {
//   try {
//     const imageUrl = req.file.path;

//     res.json({
//       message: "Upload success",
//       image: imageUrl,
//     });
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// module.exports = router;