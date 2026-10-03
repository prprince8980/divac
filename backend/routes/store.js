const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Order = require('../models/Order');
const Customer = require('../models/Customer');
const mongoose = require('mongoose');

// POST /api/store/login
// Phone-only sign-in; phone ownership is not verified.
router.post('/login', async (req, res) => {
  try {
    const { phone } = req.body || {};
    if (typeof phone !== 'string') {
      return res.status(400).json({ error: 'A mobile number is required' });
    }

    const cleanedPhone = phone.replace(/[\s()-]/g, '');
    const normalizedPhone = /^\d{10}$/.test(cleanedPhone)
      ? `+91${cleanedPhone}`
      : cleanedPhone.startsWith('+')
        ? cleanedPhone
        : `+${cleanedPhone}`;
    if (!/^\+[1-9]\d{6,14}$/.test(normalizedPhone)) {
      return res.status(400).json({ error: 'Enter a valid mobile number, including its country code' });
    }

    let customer;
    try {
      customer = await Customer.findOneAndUpdate(
        { phone: normalizedPhone },
        { $setOnInsert: { phone: normalizedPhone } },
        { new: true, upsert: true, runValidators: true }
      ).lean();
    } catch (err) {
      if (err.code !== 11000) throw err;
      customer = await Customer.findOne({ phone: normalizedPhone }).lean();
      if (!customer) throw err;
    }

    res.json({ customer: { id: customer._id, phone: customer.phone } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not save your account. Please try again.' });
  }
});

// GET /api/store/products?page=1&limit=24&search=tote
router.get('/products', async (req, res) => {
  try {
    let { page = 1, limit = 24, search = '' } = req.query;
    if (typeof search !== 'string') {
      return res.status(400).json({ error: 'Search must be a string' });
    }
    page = parseInt(page, 10);
    limit = Math.min(parseInt(limit, 10) || 24, 50);

    const filter = {};
    if (search) {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.name = { $regex: escapedSearch, $options: 'i' };
    }

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-notes')
      .lean();

    res.json({ products, pagination: { page, limit, total, pages: Math.max(1, Math.ceil(total / limit)) } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/store/products/:id
router.get('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid product id' });
    const product = await Product.findById(id).select('-notes').lean();
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/store/checkout
// Body: { customer: {name,email,phone,address}, items: [{ productId, quantity }] }
router.post('/checkout', async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { customer, items } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'No items provided' });
    }

    let total = 0;
    const orderItems = [];

    await session.withTransaction(async () => {
      for (const it of items) {
        const prod = await Product.findById(it.productId).session(session);
        if (!prod) throw new Error('Product not found: ' + it.productId);
        if (prod.quantity < it.quantity) throw new Error(`Not enough stock for ${prod.name}`);

        // decrement
        prod.quantity -= it.quantity;
        await prod.save({ session });

        orderItems.push({ product: prod._id, productName: prod.name, unitPrice: prod.price, quantity: it.quantity });
        total += prod.price * it.quantity;
      }

      const orderNumber = 'DV-' + Date.now();
      const order = new Order({ orderNumber, customer, items: orderItems, total, status: 'pending' });
      await order.save({ session });
    });

    session.endSession();
    res.json({ ok: true, message: 'Order placed' });
  } catch (err) {
    await session.abortTransaction().catch(()=>{});
    session.endSession();
    console.error(err);
    res.status(400).json({ error: err.message || 'Checkout failed' });
  }
});

module.exports = router;
