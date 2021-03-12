const PORT = process.env.PORT || 5000;
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const app = express();
const config = require("config");
require("dotenv").config();
//custom imports
const userRouter = require("./routes/userRouter");
const categoryRouter = require("./routes/categoryRouter");
const uploadRouter = require("./routes/uploadRouter");
const productRouter = require("./routes/productRouter");

app.use(morgan("combined"));
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

//routers
app.use("/user", userRouter);
app.use("/api", categoryRouter);
app.use("/api", uploadRouter);
app.use("/api", productRouter);

//connect mongodb
const URI = config.get("URI");
mongoose.connect(
  URI,
  {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  (err) => {
    if (err) throw err;
    console.log("CONNECTED TO MONGODB");
  }
);

app.listen(PORT, () => {
  console.log(`APP LISTENING ON PORT ${PORT}`);
});
