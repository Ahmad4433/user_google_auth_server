const User = require("../models/User");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const findedUser = await User.findOne({ email });
    if (!findedUser) {
      const error = new Error("no user found");
      error.statusCode = 400;
      throw error;
    }

    const isMatchPassword = await bcrypt.compare(password, findedUser.password);
    if (!isMatchPassword) {
      const error = new Error("incorrect password");
      error.statusCode = 400;
      throw error;
    }

    const { accessToken, refreshToken } = generateToken(findedUser, "7d");
    res.cookie("accessToken", accessToken);
    res.cookie("refreshToken", refreshToken);
    res
      .status(200)
      .json({ message: "login successfully", status: true, user: findedUser });
  } catch (error) {
    next(error);
  }
};

module.exports = login;
