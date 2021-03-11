const router = require("express").Router();
const produtController = require("../controllers/productController");

router
  .route("/product")
  .get(produtController.getProduct)
  .post(produtController.createProduct);

router
  .route("/product/:id")
  .delete(produtController.deleteProduct)
  .put(produtController.updateProduct);

module.exports = router;
