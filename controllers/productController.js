const Product = require("../models/product");
const Category = require("../models/category");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.product_list = asyncHandler(async (req, res, next) => {
  const allProducts = await Product.find().sort({ name: 1 }).exec();
  res.render("product_list", {
    title: "All Products",
    product_list: allProducts,
  });
});

exports.product_detail = asyncHandler(async (req, res, next) => {
  const product = await Product.findById({ _id: req.params.id })
    .populate("category")
    .exec();
  res.render("product_detail", {
    product: product,
  });
});

exports.product_create_get = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find().sort({ name: 1 }).exec();
  res.render("product_form", {
    title: "Add Product",
    category_list: allCategories,
  });
});

exports.product_create_post = [
  body("name", "Name must not be empty").trim().isLength({ min: 1 }).escape(),
  body("category", "Category must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price", "Price must not be empty").trim().isLength({ min: 1 }).escape(),
  body("number_in_stock", "Stock must not be empty")
    .isNumeric({ gt: 0 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const product = new Product({
      name: req.body.name,
      category: req.body.category,
      price: parseFloat(req.body.price),
      number_in_stock: req.body.number_in_stock,
    });

    if (req.body.description) product.description = req.body.description;

    if (!errors.isEmpty()) {
      const allCategories = await Category.find().sort({ name: 1 }).exec();
      res.render("product_form", {
        product: product,
        category_list: allCategories,
        errors: errors.array(),
      });
    } else {
      await product.save();
      res.redirect(product.url);
    }
  }),
];

exports.product_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Product delete GET");
});

exports.product_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Product delete POST");
});

exports.product_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Product update GET");
});

exports.product_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Product update POST");
});
