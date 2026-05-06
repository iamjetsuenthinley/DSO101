// backend/index.js

// Load environment variables FIRST, before anything else
// This makes process.env.PORT, process.env.DB_HOST, etc. available
require('dotenv').config();

// Import required packages
const express = require('express');
const cors = require('cors');

// Import our tasks router
const tasksRouter = require('./routes/tasks');

// Create an Express application instance
const app = express();

// ─────────────────────────────────────────────
// MIDDLEWARE
// Middleware are functions that run on every request before it hits your routes
// ─────────────────────────────────────────────

// Enable CORS (Cross-Origin Resource Sharing)
// Without this, the browser blocks requests from http://localhost:5173 (frontend)
// to http://localhost:5000 (backend) because they're on different ports
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// Parse incoming JSON request bodies
// Without this, req.body would be undefined when the frontend sends JSON data
app.use(express.json());

// ─────────────────────────────────────────────
// ROUTES
// ─────────────────────────────────────────────

// Mount the tasks router at the /tasks path
// This means:
//   GET    /tasks      → handled by tasksRouter's GET /
//   POST   /tasks      → handled by tasksRouter's POST /
//   PUT    /tasks/:id  → handled by tasksRouter's PUT /:id
//   DELETE /tasks/:id  → handled by tasksRouter's DELETE /:id
app.use('/tasks', tasksRouter);

// A simple health-check route — useful for CI/CD pipelines to verify the server is up
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// ─────────────────────────────────────────────
// START THE SERVER
// ─────────────────────────────────────────────

// Use the PORT from the .env file, or fall back to 5000
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend server is running at http://localhost:${PORT}`);
});