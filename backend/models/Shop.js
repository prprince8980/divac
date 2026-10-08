const mongoose = require('mongoose');

const ShopSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  photoUrl: { type: String, required: true },
  locationUrl: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.models.Shop || mongoose.model('Shop', ShopSchema);
