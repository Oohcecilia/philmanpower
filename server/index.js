require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const db = require('./db');

const app = express();
const PORT = process.env.API_PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';

// Middleware
app.use(cors({
  origin: [
    process.env.CORS_ORIGIN || 'http://localhost:5173',
    "http://192.168.10.89:3000",
    "http://localhost:3000"
  ],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

// ──────────────────────────────────────────────
//  ORDER MATTERS: static routes BEFORE SPA fallback
// ──────────────────────────────────────────────

// 1. Uploaded files — served statically at /uploads/*
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 2. API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/entities', require('./routes/entities'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/email', require('./routes/email'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 3. Production-only: serve the built frontend from ../dist
if (isProduction) {
  const distPath = path.join(__dirname, '..', 'dist');
  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));

    // ⚠️  SPA catch-all — must be the LAST route registered.
    // Everything after this will be unreachable.
    // React Router handles client-side routing from here.
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });

    console.log(`   Frontend: serving from ${distPath}`);
  } else {
    console.warn(`   ⚠️  dist/ not found at ${distPath}. Run "npm run build" first.`);
  }
}

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
    console.log(`   Mode:   ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`);
    console.log(`   Health: http://localhost:${PORT}/api/health`);
    console.log(`   Auth:   http://localhost:${PORT}/api/auth/login`);
    console.log(`   Data:   http://localhost:${PORT}/api/entities/services/list`);
    if (isProduction) {
      console.log(`   Frontend: http://localhost:${PORT}/`);
    }
    console.log('');
  });
}

start();
