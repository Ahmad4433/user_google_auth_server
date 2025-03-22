const jwt = require("jsonwebtoken");
const auth = (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY, (error, decoded) => {
      if (error) {
        const error = new Error("unauthorized");
        error.statusCode = 403;
        throw error;
      } else {
        req.id = decoded.id;
      }
    });

    next();
  } catch (error) {
    next(error);
  }
};
module.exports = auth;
