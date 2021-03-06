const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema(
  {
    user: {
      _id: { type: mongoose.Types.ObjectId, required: true, index: true },
      nickname: { type: String, required: true },
      email: { type: String, required: true },
    },
    likes: [
      {
        _id: { type: mongoose.Types.ObjectId, required: true },
        nickname: { type: String, required: true },
        email: { type: String, required: true },
      },
    ],
    public: { type: Boolean, required: true, default: false },
    key: { type: String, required: true },
    originalFileName: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("image", ImageSchema);
