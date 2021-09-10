const mongoose = require("mongoose");
const User = require("../models/User");

const authenticate = async (req, res, next) => {
  const { sessionid } = req.headers; // 소문자?
  if (!mongoose.isValidObjectId(sessionid)) return next();
  const user = await User.findOne({ "sessions._id": sessionid });
  if (!user) return next();
  req.user = user;
  console.log("req.user", req.user);
  // sessions의 createAt을 조회하여 req.user를 처리해주지 않고, sessionid를 지워버리는 식으로 보안을 강화해준다.
  return next();
};

module.exports = { authenticate };
