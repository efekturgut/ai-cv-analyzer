const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../utils/upload");
const { uploadCv, analyzeCv } = require("../controllers/cvController");

router.post("/upload", authMiddleware, upload.single("cv"), uploadCv);
router.get("/:id/analyze", authMiddleware, analyzeCv);

module.exports = router;