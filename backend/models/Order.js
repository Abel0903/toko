const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema({
  productId: String,
  variantId: String,
  price: Number,
  status: { type: String, default: 'pending' },
  payment: { provider: String, provider_id: String, status: String }
})

module.exports = mongoose.model('Order', OrderSchema)
