const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: false },
  productName: { type: String, required: true },
  unitPrice: { type: Number, required: true },
  quantity: { type: Number, required: true }
}, { _id: false });

const OrderStatusHistorySchema = new mongoose.Schema({
  status: { type: String, required: true },
  changedAt: { type: Date, default: Date.now }
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
  statusHistory: { type: [OrderStatusHistorySchema], default: [] },
  status: {
    type: String,
    enum: ['pending', 'processing', 'accepted', 'rejected', 'cancelled'],
    default: 'pending'
  },
  isAccepted: { type: Boolean, default: false },
  isCancelled: { type: Boolean, default: false },
  cancelledAt: { type: Date, default: null },
  deliveryDateTime: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.models.Order || mongoose.model('Order', OrderSchema);
