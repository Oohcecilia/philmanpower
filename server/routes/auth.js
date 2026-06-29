const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const { generateToken, authMiddleware } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }
    const users = db.readData('users');
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    const token = generateToken(user);
    const { password: _, ...safeUser } = user;
    res.json({ user: safeUser, token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    const users = db.readData('users');
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    const newUser = {
      id: `user-${Date.now()}`,
      email,
      name: email.split('@')[0],
      role: 'admin',
      password,
      created_date: new Date().toISOString(),
    };
    users.push(newUser);
    db.writeData('users', users);
    res.json({ message: 'Registration successful. Please check your email for verification.' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const users = db.readData('users');
    const user = users.find(u => u.username === req.user.username);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const { password, ...safeUser } = user;
    res.json(safeUser);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out' });
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  res.json({ message: 'If an account exists, a reset link will be sent.' });
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  res.json({ message: 'Password reset successful.' });
});

module.exports = router;
