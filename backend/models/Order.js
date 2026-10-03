const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: false },
  productName: { type: String, required: true },
  unitPrice: { type: Number, required: true },
  quantity: { type: Number, required: true }
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  customer: {
    name: String,
    email: String,
    phone: String,
    address: String
  },
  items: [OrderItemSchema],
  total: Number,
  status: { type: String, default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.models.Order || mongoose.model('Order', OrderSchema);
