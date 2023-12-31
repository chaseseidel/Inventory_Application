const Category = require("../models/category");
const Product = require("../models/product");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.index = asyncHandler(async (req, res, next) => {
  res.render("index", {
    title: "Inventory Application",
  });
});

exports.category_list = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find().exec();
  res.render("category_list", {
    title: "All Categories",
    category_list: allCategories,
  });
});

exports.category_detail = asyncHandler(async (req, res, next) => {
  const [category, allProductsInCategory] = await Promise.all([
    Category.findById({ _id: req.params.id }).exec(),
    Product.find({ category: req.params.id }, { name: 1 }).exec(),
  ]);
  res.render("category_detail", {
    category: category,
    product_list: allProductsInCategory,
  });
});

exports.category_create_get = asyncHandler(async (req, res, next) => {
  res.render("category_form", {
    title: "Add Category",
  });
});

exports.category_create_post = [
  body("name", "Name must not be empty").trim().isLength({ min: 1 }).escape(),
  body("description", "Description must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const category = new Category({
      name: req.body.name,
      description: req.body.description,
    });

    if (!errors.isEmpty()) {
      res.render("category_form", {
        category: category,
        errors: errors.array(),
      });
    } else {
      await category.save();
      res.redirect(category.url);
    }
  }),
];

exports.category_delete_get = asyncHandler(async (req, res, next) => {
  const [category, allProductsInCategory] = await Promise.all([
    Category.findById({ _id: req.params.id }).exec(),
    Product.find({ category: req.params.id }, { name: 1 }).exec(),
  ]);

  if (category === null) {
    res.redirect("/categories");
  }

  res.render("category_delete", {
    title: "Category",
    category: category,
    category_products: allProductsInCategory,
  });
});

exports.category_delete_post = asyncHandler(async (req, res, next) => {
  const [category, allProductsInCategory] = await Promise.all([
    Category.findById({ _id: req.params.id }).exec(),
    Product.find({ category: req.params.id }, { name: 1 }).exec(),
  ]);

  if (allProductsInCategory.length > 0) {
    res.render("category_delete", {
      title: "Category",
      category: category,
      category_products: allProductsInCategory,
    });
    return;
  } else {
    await Category.findByIdAndRemove({ _id: req.params.id });
    res.redirect("/categories");
  }

  res.render("category_delete", {
    title: "Category",
    category: category,
    category_products: allProductsInCategory,
  });
});

exports.category_update_get = asyncHandler(async (req, res, next) => {
  const category = await Category.findById({ _id: req.params.id }).exec();

  res.render("category_form", {
    title: "Update Category: " + category.name,
    category: category,
  });
});

exports.category_update_post = [
  body("name", "Name must not be empty").trim().isLength({ min: 1 }).escape(),
  body("description", "Description must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const category = new Category({
      name: req.body.name,
      description: req.body.description,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      res.render("category_form", {
        category: category,
        errors: errors.array(),
      });
    } else {
      const updatedCategory = await Category.findByIdAndUpdate(
        req.params.id,
        category,
        {}
      );
      res.redirect(updatedCategory.url);
    }
  }),
];
