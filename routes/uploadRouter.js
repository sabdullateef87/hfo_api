const router = require("express").Router();
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
router.post("/upload", async (req, res) => {
  try {
    if (!req.files)
      return res.status(400).json({ message: "No file was uploaded" });

    const file = req.files.file;
    console.log(file);

    if (file.size > 1024 * 1024) {
      return res
        .status(400)
        .json({ message: "File too large, must be less than 1MB" });
      removeTpm(file.tempFilePath);
    }

    if (file.mimetype !== "image/png" && file.mimetype !== "image/jpeg") {
      return res.status(400).json({ message: "File-type not supported" });
      removeTpm(file.tempFilePath);
    }

    cloudinary.uploader.upload(file.tempFilePath, (error, result) => {
      if (error) throw error;
      removeTpm(file.tempFilePath);

      res.json({
        secure_url: result.secure_url,
        public_id: result.public_id,
      });
    });
  } catch (err) {
    if (err) return res.status(500).json({ message: err.message });
  }
});
router.post("/destroy", async (req, res) => {
  try {
    const { public_id } = req.body;
    if (!public_id)
      return res
        .status(400)
        .json({ message: "No image available for deletion" });
    cloudinary.uploader.destroy(public_id, async (err, result) => {
      if (err) throw err;
      res.json({ message: "Image successfully deleted" });
    });
  } catch (err) {
    if (err) return res.status(500).json({ message: err.message });
  }
});
const removeTpm = (folderName) => {
  fs.unlink(folderName, (err) => {
    if (err) throw err;
    return;
  });
};
module.exports = router;
