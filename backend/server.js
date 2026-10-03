require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || '';
const MONGODB_DB = process.env.MONGODB_DB || 'diva_admin';

// CORS
const origins = (process.env.PUBLIC_APP_ORIGINS || 'http://localhost:3000').split(',').map(s => s.trim());
app.use(cors({ origin: origins }));

// static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// connect to mongodb
(async function connect() {
  try {
    if (!MONGODB_URI) console.warn('MONGODB_URI not set, backend will fail to connect until .env is configured');
    await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connect error', err.message);
  }
})();

// routes
app.use('/api/store', require('./routes/store'));

app.get('/', (req, res) => res.json({ ok: true, message: 'Diva backend running' }));

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
