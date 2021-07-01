const Users = require("../models/userModel");
const validateEmail = require("../utils/emailValidate");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userController = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ message: "Please fill in all fields !" });
      }
      if (!validateEmail(email)) {
        res
          .status(400)
          .json({ message: "Email is not in the correct format." });
      }
      const user = await Users.findOne({ email });
      if (user) {
        return res.status(400).json({ message: "User Already exists" });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = new Users({
        name,
        email,
        password: passwordHash,
      });
      await newUser.save();

      // Token generations for registered user
      const accesstoken = generateAccessToken({ id: newUser._id });
      const refreshtoken = generateRefreshToken({ id: newUser._id });

      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        path: "/user/refresh_token",
      });
      
      return res.json({ message: "User Registered Successfully!" });
    } catch (err) {
      if (err) throw err;
      return res.status(500).json({ message: err.message });
    }
  },
  refresh_token: (req, res) => {
    const rf_token = req.cookies.refreshtoken;
    if (!rf_token)
      return res.status(400).json({ message: "Please register or login" });
    jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err)
        return res.status(400).json({ message: "Please login or register" });
      const accesstoken = generateAccessToken({ id: user.id });
      res.json({ accesstoken });
    });
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email)
        return res.status(400).json({ message: "Please enter your email" });
      if (!password)
        return res.status(400).json({ message: "Please input your password" });

      const user = await Users.findOne({ email: email });
      if (!user)
        return res.status(400).json({ message: "User does not exist" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ message: "Incorrect Password" });

      // Token generations for registered user
      const accesstoken = generateAccessToken({ id: user._id });
      const refreshtoken = generateRefreshToken({ id: user._id });
      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        path: "/user/refresh_token",
      });
      res.json({ accesstoken });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
  logout: async (req, res) => {
    res.clearCookie("refreshtoken", { path: "/user/refresh_token" });
    return res.json({ message: "User logged out successfully" });
  },
  getUser: async (req, res) => {
    try {
      const users = await Users.findById(req.user.id).select("-password");
      if (!users)
        return res.status(400).json({ message: "User does not exist" });
      res.json(users);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },
  addCart: async (req, res) => {
    const id = req.user.id;
    const user = await Users.findById({ _id: id });
    const cart = req.body.cart;
    if (!user) res.status(400).json({ message: "user does not exist" });
    await Users.findOneAndUpdate({ _id: id }, { cart: cart });
    res.json({ message: "cart update successfully" });
  },
};


const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
};
const generateRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};
module.exports = userController;
