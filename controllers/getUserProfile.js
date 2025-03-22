const User = require("../models/User");

const getUserProfile = async (req, res, next) => {
  const userId = req.id;
  try {
    const findedUser = await User.findById(userId);

    res.status(200).json({
      message: "success",
      status: true,
      user: { name: findedUser.name, email: findedUser.email },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getUserProfile;
