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
  // console.log(req.file);
  const image = await new Image({
    key: req.file.filename,
    originalFileName: req.file.originalname,
  }).save();
  console.log(image);
  res.json(image);
});

module.exports = { imageRouter };
