const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
  name: String,
  images: [String],
  variants: [{ id: String, name: String, price: Number, stock: Number }]
})

module.exports = mongoose.model('Product', ProductSchema)
