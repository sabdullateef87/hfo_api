const Product = require("../models/productModel");

const productController = {
  getProduct: async (req, res) => {
    try {
      const products = await Product.find();
      res.json(products);
    } catch (error) {
      if (error) return res.status(500).json({ message: error.message });
    }
  },
  createProduct: async (req, res) => {
    try {
      const {
        product_id,
        title,
        price,
        description,
        content,
        images,
        category,
      } = req.body;

      if (!images)
        return res.status(400).json({ message: "Images Needs to be uploaded" });

      const product = await Product.findOne({ product_id });
      if (product)
        return res.status(400).json({ message: "Product already exists" });

      const newProduct = new Product({
        product_id,
        title,
        price,
        description,
        content,
        images,
        category,
      });
      await newProduct.save();

      res.json({ message: "Product created successfully" });
    } catch (error) {
      if (error) return res.status(500).json({ message: error.message });
    }
  },
  updateProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, price, description, content, category } = req.body;
      await Product.findOneAndUpdate(
        { _id: id },
        { title, price, description, content, category }
      );

      res.json({ message: "Product updated successfully" });
    } catch (error) {
      if (error) return res.status(500).json({ message: error.message });
    }
  },
  deleteProduct: async (req, res) => {
    try {
      await Product.findByIdAndDelete(req.params.id);
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      if (error) return res.status(500).json({ message: error.message });
    }
  },
};
module.exports = productController;
