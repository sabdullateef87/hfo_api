const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter a name"],
      trim: true,
    },
    avatar: {
      type: String,
      defualt: "",
    },
    email: {
      type: String,
      required: [true, "Please provide an email address"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
    },
    role: {
      type: Number,
      default: 0,
    },
    cart: [],
  },
  { timestamps: rtue }
);

module.exports = mongoose.model("Users", UserSchema);
