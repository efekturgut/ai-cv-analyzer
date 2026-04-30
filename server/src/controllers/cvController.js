const pool = require("../utils/db");

exports.uploadCv = async (req, res) => {
  try {
    const userId = req.user.userId;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "Dosya yüklenmedi" });
    }

    const result = await pool.query(
      `INSERT INTO cv_files (user_id, file_name, file_path)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [userId, file.originalname, file.path]
    );

    res.status(201).json({
      message: "CV başarıyla yüklendi",
      cv: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "CV yüklenirken hata oluştu" });
  }
};