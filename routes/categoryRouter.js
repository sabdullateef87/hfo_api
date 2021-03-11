const router = require("express").Router();
const categoryController = require("../controllers/categoryController");
const auth = require("../middlewares/auth");
const authAdmin = require("../middlewares/authAdmin");
router
  .route("/category")
  .get(categoryController.getCategories)
  .post(categoryController.createCategory);

router
  .route("/category/:id")
  .delete(categoryController.deleteCategory)
  .put(categoryController.updateCategory);
module.exports = router;
