// backend/db.js

// Load environment variables from our .env file
require('dotenv').config();

// Import the Pool class from the 'pg' (PostgreSQL) package
const { Pool } = require('pg');

// Create a new connection pool using environment variables
// This keeps our database credentials out of our source code
const pool = new Pool({
  host: process.env.DB_HOST,         // e.g., "localhost"
  user: process.env.DB_USER,         // e.g., "postgres"
  password: process.env.DB_PASSWORD, // your PostgreSQL password
  database: process.env.DB_NAME,     // e.g., "todo_db"
  port: 5432,                        // default PostgreSQL port
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

// Export the pool so other files can use it to query the database
module.exports = pool;