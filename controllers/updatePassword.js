const User = require("../models/User");
const bcrypt = require("bcrypt");
const updatePassword = async (req, res, next) => {
  const { password } = req.body;
  const id = req.id;
  try {
    const findedUser = await User.findById(id);

    if (!findedUser.password_otp.status) {
      const error = new Error("something went wrong");
      error.statusCode = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    findedUser.password = hashedPassword;
    findedUser.password_otp.status = false;
    await findedUser.save();
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res
      .status(200)
      .json({ message: "password updated successfully", status: true });
  } catch (error) {
    next(error);
  }
};

module.exports = updatePassword;
