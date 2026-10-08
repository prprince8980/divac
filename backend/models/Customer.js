const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  googleId: {
    type: String,
    unique: true,
    sparse: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    trim: true,
    default: ''
  },
  phone: {
    type: String,
    default: null,
    unique: true,
    sparse: true,
    match: /^\+?[1-9]\d{6,14}$/
  }
}, { timestamps: true });

module.exports = mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);
