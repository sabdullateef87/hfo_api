const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name!!"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please enter your email bro"],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please How can you not have a password are you dumb? "],
    },
    role: {
      type: Number,
      default: 0,
    },
    avatar: {
      type: String,
      default: "",
    },
    cart: [],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Users", userSchema);
