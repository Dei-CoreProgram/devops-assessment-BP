const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 8080;
const API_KEY = '2f5ae96c-b558-4c7b-a590-a501ae1c3f6c';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Auth Middleware
const authMiddleware = (req, res, next) => {
  const apiKey = req.headers['x-parse-rest-api-key'];
  const jwtToken = req.headers['x-jwt-kwy'];

  // Validate API Key
  if (apiKey !== API_KEY) {
    return res.status(401).send('ERROR');
  }

  // Validate JWT
  if (!jwtToken) {
    return res.status(401).send('ERROR');
  }

  try {
    jwt.verify(jwtToken, JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).send('ERROR');
  }
};

// POST /DevOps endpoint
app.post('/DevOps', authMiddleware, (req, res) => {
  const { message, to, from, timeToLifeSec } = req.body;

  if (!to) {
    return res.status(400).json({ message: 'ERROR' });
  }

  const response = {
    message: `Hello ${to} your message will be send`
  };

  res.json(response);
});

// Handle other methods
app.all('/DevOps', (req, res) => {
  if (req.method !== 'POST') {
    res.send('ERROR');
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
