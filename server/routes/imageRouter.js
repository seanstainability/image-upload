const { Router } = require("express");
const imageRouter = Router();
const fs = require("fs");
const { promisify } = require("util");
const fileUnlink = promisify(fs.unlink);
const mongoose = require("mongoose");

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
imageRouter.delete("/:imageId", async (req, res) => {
  try {
    if (!req.user) throw new Error("권한이 없습니다.");
    console.log(req.params);
    if (!mongoose.isValidObjectId(req.params.imageId))
      throw new Error("올바르지 않은 이미지 형식입니다.");
    const image = await Image.findOneAndDelete({ _id: req.params.imageId });
    if (!image)
      return res.json({ message: "요청하신 사진은 이미 삭제되었습니다." });
    await fileUnlink(`./uploads/${image.key}`);
    res.json({ message: "요청하신 이미지가 삭제되었습니다.", image });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});
imageRouter.patch("/:imageId/like", async (req, res) => {
  try {
    if (!req.user) throw new Error("권한이 없습니다.");
    console.log(req.params);
    if (!mongoose.isValidObjectId(req.params.imageId))
      throw new Error("올바르지 않은 이미지 형식입니다.");
    const image = await Image.findOneAndUpdate(
      { _id: req.params.imageId },
      {
        $addToSet: {
          // 동일한 게 없을 경우에만 업데이트
          likes: {
            _id: req.user.id,
            nickname: req.user.nickname,
            email: req.user.email,
          },
        },
      },
      { new: true }
    );
    res.json(image);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});
imageRouter.patch("/:imageId/unlike", async (req, res) => {
  try {
    if (!req.user) throw new Error("권한이 없습니다.");
    console.log(req.params);
    if (!mongoose.isValidObjectId(req.params.imageId))
      throw new Error("올바르지 않은 이미지 형식입니다.");
    const image = await Image.findOneAndUpdate(
      { _id: req.params.imageId },
      {
        $pull: {
          likes: {
            _id: req.user.id,
          },
        },
      },
      { new: true }
    );
    res.json(image);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

module.exports = { imageRouter };
