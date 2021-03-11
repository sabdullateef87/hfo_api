const jwt = require("jsonwebtoken");
const auth = async (req, res, next) => {
  try {
    const accesstoken = req.header("Authorization");
    if (!accesstoken)
      return res
        .status(400)
        .json({ message: "Access Denied - Invalid Authentication" });
    jwt.verify(accesstoken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err)
        return res
          .status(400)
          .json({ message: "Access Denied - Invalid Authentication" });

      req.user = user;
      next();
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = auth;
