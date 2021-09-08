const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const Image = require("./models/Image");

const multer = require("multer");
const { v4: uuid } = require("uuid");
const mime = require("mime-types");
// const upload = multer({ dest: "uploads/" });
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads"),
  filename: (req, file, cb) =>
    cb(null, `${uuid()}.${mime.extension(file.mimetype)}`),
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (["image/png", "image/jpeg"].includes(file.mimetype)) cb(null, true);
    else cb(new Error("해당 파일 타입은 업로드할 수 없습니다."), false);
  },
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const app = express();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected!");
    app.use("/uploads", express.static("./uploads"));
    app.get("/images", async (req, res) => {
      const images = await Image.find();
      // console.log(images);
      res.json(images);
    });
    app.post("/images", upload.single("image"), async (req, res) => {
      // console.log(req.file);
      const image = await new Image({
        key: req.file.filename,
        originalFileName: req.file.originalname,
      }).save();
      console.log(image);
      res.json(image);
    });

    app.listen(process.env.PORT, () => {
      console.log(`Server Listening on PORT ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });
