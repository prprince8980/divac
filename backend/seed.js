require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const MONGODB_URI = process.env.MONGODB_URI || '';
const MONGODB_DB = process.env.MONGODB_DB || 'diva_admin';

async function run() {
  if (!MONGODB_URI) return console.error('.env MONGODB_URI required');
  await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB });
  console.log('Connected');

  const items = [
    { name: 'Everyday leather tote', price: 4250, quantity: 8, description: 'A durable everyday bag.', images: ['/uploads/sample1.webp'] },
    { name: 'Classic sneakers', price: 2999, quantity: 15, description: 'Comfortable casual sneakers.', images: ['/uploads/sample2.webp'] },
    { name: 'Cozy sweatshirt', price: 1599, quantity: 20, description: 'Warm and soft sweatshirt.', images: ['/uploads/sample3.webp'] }
  ];

  for (const it of items) {
    const existing = await Product.findOne({ name: it.name });
    if (!existing) await Product.create(it);
  }

  const shop = {
    slug: 'diva-store',
    photoUrl: '/shop-photo.jpg',
    locationUrl: 'https://maps.app.goo.gl/bZFpWbAVrpeLfskZ8'
  };
  await mongoose.model('Shop').findOneAndUpdate(
    { slug: shop.slug },
    { $set: shop },
    { upsert: true, new: true, runValidators: true }
  );

  console.log('Seed complete');
  process.exit(0);
}

run().catch(err=>{ console.error(err); process.exit(1); });
