const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const { imageRouter } = require("./routes/imageRouter");
const { userRouter } = require("./routes/userRouter");
const { authenticate } = require("./middlewares/authentication");
const app = express();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected!");
    app.use(express.json());
    app.use(authenticate);
    app.use("/uploads", express.static("./uploads"));
    app.use("/users", userRouter);
    app.use("/images", imageRouter);

    app.listen(process.env.PORT, () => {
      console.log(`Server Listening on PORT ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });
