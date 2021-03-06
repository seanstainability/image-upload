const { Router } = require("express");
const imageRouter = Router();
// const fs = require("fs");
// const { promisify } = require("util");
// const fileUnlink = promisify(fs.unlink);
const mongoose = require("mongoose");
const { v4: uuid } = require("uuid");
const mime = require("mime-types");

const Image = require("../models/Image");
const { upload } = require("../middlewares/imageUpload");
const { s3, getSignedUrl } = require("../aws");

imageRouter.get("/", async (req, res) => {
  try {
    const { lastId } = req.query;
    if (lastId && !mongoose.isValidObjectId(lastId))
      throw new Error("페이지 정보가 올바르지 않습니다.");
    const images = await Image.find(
      lastId ? { public: true, _id: { $lt: lastId } } : { public: true }
    )
      .sort({ _id: -1 })
      .limit(20);
    // console.log(images);
    res.json(images);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});
imageRouter.get("/:imageId", async (req, res) => {
  try {
    const { imageId } = req.params;
    if (!mongoose.isValidObjectId(imageId))
      throw new Error("올바르지 않은 이미지 입니다.");
    const image = await Image.findOne({ _id: imageId });
    if (!image) throw new Error("해당 이미지는 존재하지 않습니다.");
    if (
      !image.public &&
      (!req.user || req.user.id !== image.user._id.toString())
    )
      throw new Error("권한이 없습니다.");
    res.json(image);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});
imageRouter.post("/", upload.array("image", 10), async (req, res) => {
  try {
    // console.log(req.file);
    // console.log(req.files, req.body);
    if (!req.user) throw new Error("권한이 없습니다.");
    const { images, public } = req.body;
    const imageDocs = await Promise.all(
      images.map((image) =>
        new Image({
          user: {
            _id: req.user.id,
            nickname: req.user.nickname,
            email: req.user.email,
          },
          public: req.body.public,
          key: image.imageKey,
          originalFileName: image.originalname,
        }).save()
      )
    );
    console.log(imageDocs);
    res.json(imageDocs);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});
// imageRouter.post("/", upload.array("image", 10), async (req, res) => {
//   try {
//     // console.log(req.file);
//     // console.log(req.files, req.body);
//     if (!req.user) throw new Error("권한이 없습니다.");
//     const images = await Promise.all(
//       req.files.map(async (file) => {
//         const image = await new Image({
//           user: {
//             _id: req.user.id,
//             nickname: req.user.nickname,
//             email: req.user.email,
//           },
//           public: req.body.public,
//           // key: file.filename,
//           key: file.key.replace("raw/", ""),
//           originalFileName: file.originalname,
//         }).save();
//         return image;
//       })
//     );
//     console.log(images);
//     res.json(images);
//   } catch (err) {
//     console.error(err);
//     res.status(400).json({ message: err.message });
//   }
// });
imageRouter.post("/presigned", async (req, res) => {
  try {
    if (!req.user) throw new Error("권한이 없습니다.");
    const { contentTypes } = req.body;
    if (!Array.isArray(contentTypes)) throw new Error("invalid content type");
    const presignedData = await Promise.all(
      contentTypes.map(async (contentType) => {
        const imageKey = `${uuid()}.${mime.extension(contentType)}`;
        const key = `raw/${imageKey}`;
        const presigned = await getSignedUrl({ key });
        return { imageKey, presigned };
      })
    );
    res.json(presignedData);
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
    // await fileUnlink(`./uploads/${image.key}`);
    s3.deleteObject(
      { Bucket: "image-upload-album", Key: `raw/${image.key}` },
      (err, data) => {
        if (err) throw err;
      }
    );
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
