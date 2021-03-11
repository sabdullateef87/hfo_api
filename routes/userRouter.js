const userController = require("../controllers/userControllers");
const auth = require("../middlewares/auth");
const authAdmin = require("../middlewares/authAdmin");
const router = require("express").Router();

router.post("/register", userController.register);
router.get("/refresh_token", userController.refresh_token);
router.post("/login", userController.login);
router.get("/logout", userController.logout);
router.get("/infor", auth, userController.getUser);
router.patch("/cart", auth, userController.addCart);

module.exports = router;
