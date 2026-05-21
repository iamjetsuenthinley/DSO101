// backend/db.js

// Load environment variables from our .env file
require('dotenv').config();

// Import the Pool class from the 'pg' (PostgreSQL) package
const { Pool } = require('pg');

// Create a new connection pool using environment variables
// This keeps our database credentials out of our source code
let pool;

// If required DB env vars are missing, provide a lightweight in-memory
// fallback so the API remains usable during local development.
if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
  console.warn('⚠️  Database environment variables not set — using in-memory fallback for development');

  // Simple in-memory tasks store to mimic basic queries used by the app
  const tasks = [];
  let nextId = 1;

  pool = {
    // Very small subset of the pg Pool API used by the app
    query: async (text, params) => {
      const sql = String(text).trim().toUpperCase();

      if (sql.startsWith('SELECT')) {
        return { rows: tasks };
      }

      if (sql.startsWith('INSERT')) {
        const title = params && params[0] ? String(params[0]).trim() : '';
        const task = { id: nextId++, title, completed: false, created_at: new Date().toISOString() };
        tasks.unshift(task);
        return { rows: [task] };
      }

      if (sql.startsWith('UPDATE')) {
        const title = params[0];
        const completed = params[1];
        const id = params[2];
        const idx = tasks.findIndex(t => Number(t.id) === Number(id));
        if (idx === -1) return { rows: [] };
        tasks[idx].title = title;
        tasks[idx].completed = completed;
        return { rows: [tasks[idx]] };
      }

      if (sql.startsWith('DELETE')) {
        const id = params && params[0];
        const idx = tasks.findIndex(t => Number(t.id) === Number(id));
        if (idx === -1) return { rows: [] };
        const [removed] = tasks.splice(idx, 1);
        return { rows: [removed] };
      }

      return { rows: [] };
    },
    connect: (cb) => cb && cb(null, null, () => {}),
  };

} else {
  // Create a real PostgreSQL pool when configuration is present
  pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 5432,
  });

  // Test the connection when the server starts
  pool.connect((err, client, release) => {
    if (err) {
      console.error('❌ Error connecting to PostgreSQL:', err.message);
    } else {
      console.log('✅ Successfully connected to PostgreSQL database');
      release(); // Release the test connection back to the pool
    }
  });
}

module.exports = pool;