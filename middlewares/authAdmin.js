const Users = require("../models/userModel");

const authAdmin = async (req, res, next) => {
  try {
    const checker = req.user;

    const user = await Users.findById(checker.id);
    if (user.role === 0)
      return res
        .status(400)
        .json({ message: "Admin Access is Required - Access Denied" });
    next();
  } catch (err) {
    if (err) res.status(500).json({ message: err.message });
  }
};

module.exports = authAdmin;
