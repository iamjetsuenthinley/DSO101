// backend/routes/tasks.js

// Import Express and create a Router
// A Router is like a mini-app that handles a group of related routes
const express = require('express');
const router = express.Router();

// Import our database connection pool
const pool = require('../db');

// ─────────────────────────────────────────────
// GET /tasks — Retrieve ALL tasks
// ─────────────────────────────────────────────
// This route is called when the frontend loads the page.
// It fetches every task from the database, sorted by creation time.
router.get('/', async (req, res) => {
  try {
    // SQL query: select all columns from the tasks table, newest first
    const result = await pool.query(
      'SELECT * FROM tasks ORDER BY created_at DESC'
    );

    // Send the list of tasks as a JSON response
    // result.rows is an array of task objects
    res.json(result.rows);
  } catch (err) {
    // If something goes wrong, log the error and send a 500 (server error)
    console.error('Error fetching tasks:', err.message);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// ─────────────────────────────────────────────
// POST /tasks — Create a NEW task
// ─────────────────────────────────────────────
// The frontend sends { "title": "Buy groceries" } in the request body.
// We insert it into the database and return the newly created task.
router.post('/', async (req, res) => {
  try {
    // Extract 'title' from the request body
    const { title } = req.body;

    // Basic validation — don't allow empty task titles
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Task title cannot be empty' });
    }

    // SQL query: insert a new task with the given title
    // $1 is a placeholder for the title value (prevents SQL injection)
    // 'completed' defaults to FALSE in the database, so we don't need to set it
    // 'created_at' defaults to NOW() in the database, so we don't need to set it
    // RETURNING * gives us back the full inserted row immediately
    const result = await pool.query(
      'INSERT INTO tasks (title) VALUES ($1) RETURNING *',
      [title.trim()]
    );

    // Send the newly created task with status 201 (Created)
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating task:', err.message);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// ─────────────────────────────────────────────
// PUT /tasks/:id — Update an EXISTING task
// ─────────────────────────────────────────────
// :id is a URL parameter, e.g. PUT /tasks/3 targets the task with id=3
// The frontend sends the updated title and/or completed status.
router.put('/:id', async (req, res) => {
  try {
    // Get the task ID from the URL
    const { id } = req.params;

    // Get the updated fields from the request body
    const { title, completed } = req.body;

    // SQL query: update the task's title and completed status
    // We use $1, $2, $3 as placeholders to prevent SQL injection
    const result = await pool.query(
      'UPDATE tasks SET title = $1, completed = $2 WHERE id = $3 RETURNING *',
      [title.trim(), completed, id]
    );

    // If no rows were returned, the task ID doesn't exist
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Send back the updated task
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating task:', err.message);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// ─────────────────────────────────────────────
// DELETE /tasks/:id — Delete a task
// ─────────────────────────────────────────────
// :id targets the specific task to delete
router.delete('/:id', async (req, res) => {
  try {
    // Get the task ID from the URL
    const { id } = req.params;

    // SQL query: delete the task with this ID
    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 RETURNING *',
      [id]
    );

    // If nothing was deleted, the ID didn't exist
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Send a success message
    res.json({ message: 'Task deleted successfully', task: result.rows[0] });
  } catch (err) {
    console.error('Error deleting task:', err.message);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// Export the router so index.js can use it
module.exports = router;