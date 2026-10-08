const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Order = require('../models/Order');
const Customer = require('../models/Customer');
const Shop = require('../models/Shop');
const mongoose = require('mongoose');
const { OAuth2Client } = require('google-auth-library');
const { normalizePhone } = require('../utils/phone');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || '467903913101-evfpbnn8eb4i5n09diidu44vfgcdn1ft.apps.googleusercontent.com');

// GET /api/store/shop
router.get('/shop', async (req, res) => {
  try {
    const shop = await Shop.findOneAndUpdate(
      { slug: 'diva-store' },
      {
        $set: {
          slug: 'diva-store',
          photoUrl: 'https://drive.google.com/uc?export=view&id=1oLFFy2vvJ4fc585Ka-L7xh4270z6lwJv',
          locationUrl: 'https://maps.app.goo.gl/bZFpWbAVrpeLfskZ8'
        }
      },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    ).lean();

    res.json({ shop });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load shop details' });
  }
});

// POST /api/store/google-login
router.post('/google-login', async (req, res) => {
  try {
    const { credential } = req.body || {};
    if (!credential) {
      return res.status(400).json({ error: 'Google credential is required' });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID || '467903913101-evfpbnn8eb4i5n09diidu44vfgcdn1ft.apps.googleusercontent.com'
    });
    const payload = ticket.getPayload();
    if (!payload?.email || !payload?.sub) {
      return res.status(401).json({ error: 'Invalid Google account information' });
    }

    const customer = await Customer.findOneAndUpdate(
      { email: payload.email },
      {
        $set: {
          googleId: payload.sub,
          email: payload.email,
          name: payload.name || payload.email
        },
        $setOnInsert: { createdAt: new Date() }
      },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    ).lean();

    res.json({
      customer: {
        id: customer._id,
        googleId: customer.googleId,
        email: customer.email,
        name: customer.name,
        phone: customer.phone || null
      }
    });
  } catch (err) {
    console.error('Google login error:', err.message);
    res.status(401).json({ error: 'Google sign-in failed. Please try again.' });
  }
});

// POST /api/store/account/profile
router.post('/account/profile', async (req, res) => {
  try {
    const { customerId, name, phone } = req.body || {};
    const normalizedPhone = normalizePhone(phone);
    const trimmedName = String(name || '').trim();

    if (!customerId || !mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({ error: 'Valid account information is required' });
    }
    if (trimmedName.length < 2) {
      return res.status(400).json({ error: 'Enter your name using at least 2 characters' });
    }
    if (!normalizedPhone) {
      return res.status(400).json({ error: 'Enter a valid mobile number' });
    }

    const customer = await Customer.findOneAndUpdate(
      { _id: customerId },
      { $set: { name: trimmedName, phone: normalizedPhone } },
      { new: true, runValidators: true }
    );

    if (!customer) {
      return res.status(404).json({ error: 'Account not found' });
    }

    res.json({
      customer: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone
      }
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'This mobile number is already linked to another account.' });
    }
    console.error(err);
    res.status(500).json({ error: 'Could not save your account details. Please try again.' });
  }
});

// POST /api/store/account/phone
router.post('/account/phone', async (req, res) => {
  try {
    const { customerId, phone } = req.body || {};
    const normalizedPhone = normalizePhone(phone);
    if (!customerId || !mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({ error: 'Valid account information is required' });
    }
    if (!normalizedPhone) {
      return res.status(400).json({ error: 'Enter a valid mobile number' });
    }

    const customer = await Customer.findOneAndUpdate(
      { _id: customerId },
      { $set: { phone: normalizedPhone } },
      { new: true, runValidators: true }
    );

    if (!customer) {
      return res.status(404).json({ error: 'Account not found' });
    }

    res.json({ customer: { id: customer._id, phone: customer.phone } });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'This mobile number is already linked to another account.' });
    }
    console.error(err);
    res.status(500).json({ error: 'Could not save your mobile number. Please try again.' });
  }
});

// GET /api/store/orders?phone=+919876543210&status=cancelled
router.get('/orders', async (req, res) => {
  try {
    const { phone, status } = req.query;
    const normalizedPhone = normalizePhone(phone);
    if (!normalizedPhone) {
      return res.status(400).json({ error: 'A valid phone number is required' });
    }

    const filter = { 'customer.phone': normalizedPhone };
    if (status === 'cancelled') {
      filter.status = 'cancelled';
      filter.isCancelled = true;
    } else if (status === 'waiting') {
      filter.status = 'pending';
      filter.isCancelled = false;
    } else if (status === 'accepted') {
      filter.status = 'accepted';
      filter.isCancelled = false;
    } else if (status === 'rejected') {
      filter.status = 'rejected';
      filter.isCancelled = false;
    } else {
      filter.isCancelled = false;
      filter.status = { $in: ['pending', 'accepted', 'rejected'] };
    }

    const [orders, counts] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).lean(),
      {
        waiting: await Order.countDocuments({ 'customer.phone': normalizedPhone, isCancelled: false, status: 'pending' }),
        accepted: await Order.countDocuments({ 'customer.phone': normalizedPhone, isCancelled: false, status: 'accepted' }),
        rejected: await Order.countDocuments({ 'customer.phone': normalizedPhone, isCancelled: false, status: 'rejected' }),
        cancelled: await Order.countDocuments({ 'customer.phone': normalizedPhone, isCancelled: true, status: 'cancelled' })
      }
    ]);

    res.json({ orders, counts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load orders' });
  }
});

// POST /api/store/orders/:id/cancel
router.post('/orders/:id/cancel', async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { phone } = req.body || {};
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid order id' });
    }
    const normalizedPhone = normalizePhone(phone);
    if (!normalizedPhone) {
      return res.status(400).json({ error: 'A valid mobile number is required' });
    }

    const order = await Order.findOne({ _id: id, 'customer.phone': normalizedPhone }).session(session);
    if (!order) {
      return res.status(404).json({ error: 'Order not found for this mobile number' });
    }
    if (order.isCancelled || order.status === 'cancelled') {
      return res.status(409).json({ error: 'This order is already cancelled' });
    }
    if (order.status === 'rejected') {
      return res.status(409).json({ error: 'A rejected order cannot be cancelled' });
    }

    await session.withTransaction(async () => {
      for (const item of order.items || []) {
        if (!item.product || !item.quantity) continue;
        await Product.updateOne(
          { _id: item.product },
          { $inc: { quantity: item.quantity } },
          { session }
        );
      }

      order.status = 'cancelled';
      order.isAccepted = false;
      order.isCancelled = true;
      order.cancelledAt = new Date();
      await order.save({ session });
    });

    res.json({ ok: true, message: 'Order cancelled successfully', order: order.toObject() });
  } catch (err) {
    await session.abortTransaction().catch(() => {});
    console.error(err);
    res.status(400).json({ error: err.message || 'Could not cancel the order' });
  } finally {
    session.endSession();
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
    if (!customer || typeof customer !== 'object') {
      return res.status(400).json({ error: 'Customer details are required' });
    }
    const customerPhone = normalizePhone(customer.phone);
    if (!customerPhone) {
      return res.status(400).json({ error: 'A valid mobile number is required for this order' });
    }
    customer.phone = customerPhone;

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
      const order = new Order({
        orderNumber,
        customer,
        items: orderItems,
        total,
        status: 'pending',
        isAccepted: false,
        isCancelled: false,
        cancelledAt: null,
        deliveryDateTime: null
      });
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
