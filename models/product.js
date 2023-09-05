const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  price: { type: Number, required: true },
  number_in_stock: { type: Number, min: 0, required: true },
});

ProductSchema.virtual("url").get(function () {
  return `/product/${this._id}`;
});

module.exports = mongoose.model("Product", ProductSchema);
