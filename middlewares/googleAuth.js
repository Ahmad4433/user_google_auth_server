const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const googleAuth = async (req, res, next) => {
  const { name, email } = req?.user?._json;
  try {
    const findedUser = await User.findOne({ email });
    let savedUser;
    if (!findedUser) {
      const newUser = new User({
        name: name,
        email: email,
      });
      savedUser = await newUser.save();
    }
    const user = {
      email: findedUser?.email || email,
      _id: findedUser?._id || savedUser?._id,
    };

    const { accessToken, refreshToken } = generateToken(user,'7d');
    res.cookie("accessToken", accessToken);
    res.cookie("refreshToken", refreshToken);
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = googleAuth;
