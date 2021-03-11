const Category = require("../models/categoryModel");

const categotyController = {
  getCategories: async (req, res) => {
    try {
      const categories = await Category.find();
      res.json(categories);
    } catch (err) {
      if (err) return res.status(500).json({ message: err.message });
    }
  },
  createCategory: async (req, res) => {
    try {
      const { name } = req.body;

      if (!name)
        return res.status(400).json({ message: "Name field cannot be empty" });
      const category = await Category.findOne({ name });
      if (category)
        return res.status(400).json({ message: "Category already exists" });

      const newCategory = new Category({
        name,
      });

      await newCategory.save();
      return res.json({ message: "Category Created Successfully" });
    } catch (err) {
      if (err) return res.status(500).json({ message: err.message });
    }
  },
  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const check = await Category.findById({ _id: id });
      if (!check) res.status(400).json({ message: "Category Does not exist" });
      const category = await Category.findByIdAndDelete({ _id: id });
      return res.json({ message: "Category deleted successfully" });
    } catch (err) {
      if (err) return res.status(500).json({ message: err.message });
    }
  },
  updateCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const name = req.body.name;
      const check = await Category.findById({ _id: id });
      if (!check) res.status(400).json({ message: "Category Does not exist" });
      const category = await Category.findOneAndUpdate({ _id: id }, { name });

      res.json({ message: "Category Updated Successfully" });
    } catch (err) {
      if (err) return res.status(500).json({ message: err.message });
    }
  },
};

module.exports = categotyController;
