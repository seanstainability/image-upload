const { Router } = require("express");
const userRouter = Router();
const User = require("../models/User");
const { hash, compare } = require("bcryptjs");
const mongoose = require("mongoose");

userRouter.post("/register", async (req, res) => {
  try {
    // console.log(req.body);
    // 이메일 정규식 추가할 것
    if (req.body.password.length < 6)
      throw new Error("비밀번호는 6자 이상이어야 합니다.");
    if (req.body.nickname.length < 3)
      throw new Error("닉네임은 3자 이상이어야 합니다.");
    const hashedPassword = await hash(req.body.password, 10);
    const user = await new User({
      nickname: req.body.nickname,
      email: req.body.email,
      hashedPassword,
      sessions: [{ createdAt: new Date() }],
    }).save();
    const session = user.sessions[0];
    res.json({
      message: "user registered!",
      sessionId: session._id,
      nickname: user.nickname,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});
userRouter.patch("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    const isValid = compare(req.body.password, user.hashedPassword);
    if (!isValid) throw new Error("입력하신 정보가 올바르지 않습니다.");
    user.sessions.push({ createdAt: new Date() });
    await user.save();
    const session = user.sessions[user.sessions.length - 1];
    res.json({
      message: "user validated!",
      sessionId: session._id,
      nickname: user.nickname,
    });
  } catch (err) {
    console.error(err);
  }
});
userRouter.patch("/logout", async (req, res) => {
  try {
    console.log(req.user);
    if (!req.user) throw new Error("세션이 유효하지 않습니다.");
    await User.updateOne(
      { _id: req.user.id },
      { $pull: { sessions: { _id: req.headers.sessionid } } }
    );
    res.json({ message: "user logged out!" });
  } catch (err) {
    console.error(err);
  }
});

module.exports = { userRouter };
