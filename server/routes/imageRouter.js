const { Router } = require("express");
const imageRouter = Router();
const Image = require("../models/Image");
const { upload } = require("../middlewares/imageUpload");

imageRouter.get("/", async (req, res) => {
  const images = await Image.find();
  // console.log(images);
  res.json(images);
});
imageRouter.post("/", upload.single("image"), async (req, res) => {
  try {
    // console.log(req.file);
    if (!req.user) throw new Error("권한이 없습니다.");
    const image = await new Image({
      user: {
        _id: req.user.id,
        nickname: req.user.nickname,
        email: req.user.email,
      },
      public: req.body.public,
      key: req.file.filename,
      originalFileName: req.file.originalname,
    }).save();
    console.log(image);
    res.json(image);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

module.exports = { imageRouter };
