const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const crypto = require('crypto')
const midtrans = require('midtrans-client')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const { body, validationResult } = require('express-validator')

const Product = require('./models/Product')
const Order = require('./models/Order')
const Admin = require('./models/Admin')

dotenv.config()
const app = express()
app.use(helmet())
app.use(rateLimit({ windowMs: 60*1000, max: 120 }))
app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/webshop').catch(()=>{})

// midtrans
const snap = new midtrans.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER || '',
  clientKey: process.env.MIDTRANS_CLIENT || ''
})

// simple auth middleware
function auth(req,res,next){
  const token = req.headers['authorization']?.split(' ')[1]
  if(!token) return res.status(401).send('unauthorized')
  try{ req.admin = jwt.verify(token, process.env.JWT_SECRET || 'demo'); next() } catch(e){ res.status(401).send('invalid token') }
}

// public endpoints
app.get('/products', async (req,res)=> res.json(await Product.find()))
app.get('/products/:id', async (req,res)=> res.json(await Product.findById(req.params.id)))

// checkout
app.post('/checkout', [ body('productId').isMongoId(), body('variantId').notEmpty() ], async (req,res)=>{
  const err = validationResult(req); if(!err.isEmpty()) return res.status(422).json({errors:err.array()})

  const p = await Product.findById(req.body.productId)
  if(!p) return res.status(404).send('product not found')
  const v = p.variants.find(x => x.id === req.body.variantId)
  if(!v) return res.status(400).send('variant not found')
  if(v.stock <= 0) return res.status(400).send('out of stock')

  const order = await Order.create({
    productId: p._id.toString(),
    variantId: v.id,
    price: v.price,
    payment: { provider: 'midtrans', status: 'pending' }
  })

  const parameter = {
    transaction_details: {
      order_id: order._id.toString(),
      gross_amount: v.price
    }
  }

  const snapToken = await snap.createTransaction(parameter)
  res.json({ payment_url: snapToken.redirect_url })
})

// admin auth
app.post('/admin/login', async (req,res)=>{
  const { email, password } = req.body
  const admin = await Admin.findOne({ email })
  if(!admin) return res.status(401).send('invalid')
  const ok = await bcrypt.compare(password, admin.password)
  if(!ok) return res.status(401).send('invalid')
  const token = jwt.sign({ id: admin._id, email: admin.email }, process.env.JWT_SECRET || 'demo', { expiresIn: '7d' })
  res.json({ token })
})

// admin CRUD
app.get('/admin/products', auth, async (req,res) => res.json(await Product.find()))
app.post('/admin/products', auth, async (req,res) => {
  const p = await Product.create(req.body)
  res.json(p)
})
app.put('/admin/products/:id', auth, async (req,res) => {
  const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.json(p)
})
app.delete('/admin/products/:id', auth, async (req,res)=> {
  await Product.findByIdAndDelete(req.params.id)
  res.send('ok')
})
app.get('/admin/orders', auth, async (req,res) => res.json(await Order.find()))
app.post('/admin/orders/:id/status', auth, async (req,res) => {
  const order = await Order.findById(req.params.id)
  order.status = req.body.status
  await order.save()
  res.json(order)
})

// midtrans webhook
app.post('/webhook', async (req,res)=>{
  const data = req.body
  try {
    const signature = crypto.createHash('sha512')
      .update(data.order_id + data.status_code + data.gross_amount + (process.env.MIDTRANS_SERVER||''))
      .digest('hex')
    if(signature !== data.signature_key) return res.status(400).send('invalid')

    if(data.transaction_status === 'settlement' || data.transaction_status === 'capture') {
      const order = await Order.findById(data.order_id)
      if(!order) return res.status(404).send('order not found')
      if(order.payment.status === 'paid') return res.status(200).send('already processed')
      const product = await Product.findById(order.productId)
      const v = product.variants.find(x => x.id === order.variantId)
      v.stock = Math.max(0, v.stock - 1)
      order.payment.status = 'paid'
      await product.save(); await order.save()
    }
  } catch(e){}
  res.send('OK')
})

const PORT = process.env.PORT || 3001
app.listen(PORT, ()=> console.log('Backend running on', PORT))
