const User = require("../models/User");

const verifyOtp = async (req, res, next) => {
  const { otp } = req.body;

  try {
    const findedUser = await User.findOne({ "password_otp.otp": otp });
    if (!findedUser) {
      const error = new Error("incorrect otp");
      error.statusCode = 400;
      throw error;
    }

    if (findedUser.password_otp.otp === otp) {
      const error = new Error("incorrect otp");
      error.statusCode = 400;
      throw error;
    }

    if (findedUser.password_otp.time - new Date().getTime() <= 0) {
      const error = new Error("otp exipred");
      error.statusCode = 400;
      throw error;
    }

    findedUser.password_otp.status = true
await findedUser.save()
    res.status(200).json({ message: "otp verified", status: true });
  } catch (error) {
    next(error);
  }
};

module.exports = verifyOtp;
