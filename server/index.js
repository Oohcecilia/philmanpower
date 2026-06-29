require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.API_PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/entities', require('./routes/entities'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/email', require('./routes/email'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

async function start() {
  await db.init();
  console.log('Server data layer initialized');

  app.listen(PORT, () => {
    console.log(`\n🎯 PhilManPower API running on http://localhost:${PORT}`);
    console.log(`   Health: http://localhost:${PORT}/api/health`);
    console.log(`   Auth:   http://localhost:${PORT}/api/auth/login`);
    console.log(`   Data:   http://localhost:${PORT}/api/entities/services/list\n`);
  });
}

start();
