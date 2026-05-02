const pool = require("../utils/db");
const fs = require("fs");
const pdfParse = require("pdf-parse");

const analyzeText = (text) => {
  const lowerText = text.toLowerCase();

  const score = {
    skills: 0,
    experience: 0,
    education: 0,
  };

  if (lowerText.includes("javascript")) score.skills++;
  if (lowerText.includes("node")) score.skills++;
  if (lowerText.includes("react")) score.skills++;
  if (lowerText.includes("express")) score.skills++;
  if (lowerText.includes("postgresql")) score.skills++;
  if (lowerText.includes("sql")) score.skills++;

  if (lowerText.includes("intern")) score.experience++;
  if (lowerText.includes("staj")) score.experience++;
  if (lowerText.includes("experience")) score.experience++;
  if (lowerText.includes("project")) score.experience++;
  if (lowerText.includes("proje")) score.experience++;

  if (lowerText.includes("university")) score.education++;
  if (lowerText.includes("üniversite")) score.education++;
  if (lowerText.includes("engineering")) score.education++;
  if (lowerText.includes("mühendisliği")) score.education++;

  const total = score.skills + score.experience + score.education;

  let yorum = "CV geliştirilmeli";

  if (total >= 6) {
    yorum = "CV güçlü görünüyor";
  } else if (total >= 3) {
    yorum = "CV orta seviyede, geliştirilebilir";
  }

  return {
    score,
    total,
    yorum,
  };
};

exports.uploadCv = async (req, res) => {
  try {
    const userId = req.user.userId;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "Dosya yüklenmedi" });
    }

    const filePath = file.path;

    const result = await pool.query(
      `INSERT INTO cv_files (user_id, file_name, file_path)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [userId, file.originalname, filePath]
    );

    res.status(201).json({
      message: "CV başarıyla yüklendi",
      cv: result.rows[0],
    });
  } catch (error) {
    console.error("UPLOAD HATA:", error);
    res.status(500).json({ error: "CV yüklenirken hata oluştu" });
  }
};

exports.analyzeCv = async (req, res) => {
  try {
    const userId = req.user.userId;
    const cvId = req.params.id;

    const cvResult = await pool.query(
      "SELECT * FROM cv_files WHERE id = $1 AND user_id = $2",
      [cvId, userId]
    );

    if (cvResult.rows.length === 0) {
      return res.status(404).json({ error: "CV bulunamadı" });
    }

    const cv = cvResult.rows[0];
    const filePath = cv.file_path;

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        error: "Dosya fiziksel olarak bulunamadı",
        path: filePath,
      });
    }

    const pdfBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(pdfBuffer);

    const analysis = analyzeText(pdfData.text);

    res.json({
      message: "CV analiz edildi",
      cvId: cv.id,
      fileName: cv.file_name,
      analysis,
      text: pdfData.text,
    });
  } catch (error) {
    console.error("ANALYZE HATA:", error);
    res.status(500).json({ error: "CV analiz edilirken hata oluştu" });
  }
};