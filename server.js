const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));



app.use("/api/admin", require("./routes/Adminauth"));

app.use("/uploads", express.static("uploads"));

app.use("/api/services", require("./routes/serviceRoutes"));
app.use("/api/package", require("./routes/packageRoutes"));

app.use("/uploads", express.static("uploads"));
app.use("/api/expert", require("./routes/expertRoutes"));

app.use("/api/recentworks", require("./routes/recentWorkRoutes"));







app.listen(5000, () => {
  console.log("Server running on port 5000");
});