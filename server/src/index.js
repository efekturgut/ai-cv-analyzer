const express = require("express");
const cors = require("cors");
require("dotenv").config();

const cvRoutes = require("./routes/cvRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.json({ message: "AI CV Analyzer API çalışıyor" });
});

app.use("/api/auth", authRoutes);
app.use("/api/cv", cvRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});