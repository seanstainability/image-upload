const multer = require("multer");
const { v4: uuid } = require("uuid");
const mime = require("mime-types");
const multerS3 = require("multer-s3");
const { s3 } = require("../aws");

// const upload = multer({ dest: "uploads/" });
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "./uploads"),
//   filename: (req, file, cb) =>
//     cb(null, `${uuid()}.${mime.extension(file.mimetype)}`),
// });
const storage = multerS3({
  s3,
  bucket: "image-upload-album",
  key: (req, file, cb) =>
    cb(null, `raw/${uuid()}.${mime.extension(file.mimetype)}`),
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

module.exports = { upload };
