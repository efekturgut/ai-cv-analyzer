const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../utils/upload");
const { uploadCv } = require("../controllers/cvController");

router.post("/upload", authMiddleware, upload.single("cv"), uploadCv);

module.exports = router;