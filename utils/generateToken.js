const jwt = require("jsonwebtoken");

const generateToken = (user, exp) => {
  const accessToken = jwt.sign(
    { email: user.email, id: user._id },
    process.env.ACCESS_TOKEN_KEY,
    { expiresIn: exp }
  );

  const refreshToken = jwt.sign(
    { email: user?.email, id: user._id },
    process.env.REFRESH_TOKEN_KEY,
    { expiresIn: "30d" }
  );

  return {
    accessToken,
    refreshToken,
  };
};

module.exports = generateToken;
