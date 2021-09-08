const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const { imageRouter } = require("./routes/ImageRouter");
const app = express();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected!");
    app.use("/uploads", express.static("./uploads"));
    app.use("/images", imageRouter);

    app.listen(process.env.PORT, () => {
      console.log(`Server Listening on PORT ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });
