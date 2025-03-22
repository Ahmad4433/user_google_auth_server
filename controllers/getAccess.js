const getAccess = async (req, res, next) => {
  try {
    res.status(200).json({ message: "success", status: true });
  } catch (error) {
    next(error);
  }
};

module.exports = getAccess;
