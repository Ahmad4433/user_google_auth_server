const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const sendMail = require("../utils/sendMail");
const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const findedUser = await User.findOne({ email });
    if (!findedUser) {
      const error = new Error("no user found");
      error.statusCode = 400;
      throw error;
    }
    const userOtp = findedUser?.password_otp?.otp;
    if (userOtp) {
      const timeDiffrence =
        new Date().getTime() -
          new Date(findedUser.password_otp.last_attempt_time).getTime() <=
        24 * 60 * 60 * 1000;

      if (!timeDiffrence) {
        findedUser.password_otp.attempts = 5;
        await findedUser.save();
      }
      const otpAttempts = findedUser.password_otp.attempts === 0;

      if (otpAttempts && timeDiffrence) {
        const error = new Error("you have reached your dailt limit");
        error.statusCode = 400;
        throw error;
      }
    }

    const otp = Math.floor(Math.random() * 900000) + 100000;

    findedUser.password_otp.otp = otp;
    findedUser.password_otp.last_attempt_time = new Date();
    findedUser.password_otp.attempts--;
    findedUser.password_otp.time = new Date().getTime() + 2 * 60 * 1000;
    await findedUser.save();

    const data = {
      otp: otp,
      receiver: findedUser.email,
    };
    await sendMail(data);

    const user = {
      email: findedUser.email,
      _id: findedUser._id,
    };

    const { accessToken } = generateToken(user, "7d");
res.cookie("accessToken", accessToken, { httpOnly: true, secure:, sameSite: 'none' });


    res.status(200).json({
      message: "6-digit otp sent at" + " " + findedUser.email,
      status: true,
      otp,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = forgotPassword;
