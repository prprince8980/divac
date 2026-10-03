require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const MONGODB_URI = process.env.MONGODB_URI || '';
const MONGODB_DB = process.env.MONGODB_DB || 'diva_admin';
const origins = (process.env.PUBLIC_APP_ORIGINS || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);
let connectionPromise;

app.use(cors({
  origin(origin, callback) {
    callback(null, !origin || origins.includes(origin));
  }
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use(async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      if (!MONGODB_URI) throw new Error('MONGODB_URI is not configured');
      if (!connectionPromise) {
        connectionPromise = mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB })
          .catch(error => {
            connectionPromise = null;
            throw error;
          });
      }
      await connectionPromise;
    }
    next();
  } catch (error) {
    console.error('MongoDB connection error', error.message);
    res.status(503).json({ error: 'Database unavailable' });
  }
});

app.use('/api/store', require('../routes/store'));
app.get('/', (req, res) => res.json({ ok: true, message: 'Diva backend running' }));

module.exports = app;