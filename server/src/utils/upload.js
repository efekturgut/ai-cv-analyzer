const multer = require("multer");
const path = require("path");

// dosya nereye kaydedilecek
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(null, uniqueName + path.extname(file.originalname));
  },
});

// sadece PDF kabul et
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Sadece PDF yükleyebilirsiniz"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
});

module.exports = upload;