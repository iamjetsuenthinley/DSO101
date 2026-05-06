// frontend/src/App.jsx

// React hooks we'll use:
//   useState  — stores component state (tasks, loading, error)
//   useEffect — runs code when the component mounts (fetches tasks on load)
import { useState, useEffect } from 'react';

// axios makes HTTP requests to our backend API
import axios from 'axios';

// toast gives us pop-up notification messages
import { Toaster, toast } from 'react-hot-toast';

// Our custom components
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

// ─── API Configuration ───
// Read the backend URL from Vite's environment variables.
// VITE_API_URL is defined in frontend/.env
// Falls back to localhost for local development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  // ─── State ───
  // tasks: the array of task objects fetched from the database
  const [tasks, setTasks] = useState([]);

  // loading: true while the initial fetch is in progress
  const [loading, setLoading] = useState(true);

  // error: stores an error message string, or null if no error
  const [error, setError] = useState(null);

  // adding: true while a "create task" request is in-flight
  const [adding, setAdding] = useState(false);

  // ─────────────────────────────────────────────
  // Fetch all tasks when the component mounts
  // useEffect with an empty dependency array [] runs only once, on first render
  // ─────────────────────────────────────────────
  useEffect(() => {
    fetchTasks();
  }, []);

  // GET /tasks — Fetches all tasks from the backend
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);

      // Make a GET request to our backend API
      const response = await axios.get(`${API_URL}/tasks`);

      // response.data is the array of tasks returned by the API
      setTasks(response.data);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      setError('Could not load tasks. Is the backend server running?');
    } finally {
      // 'finally' always runs, even if an error occurred
      // This ensures we stop showing the loading spinner
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // POST /tasks — Add a new task
  // ─────────────────────────────────────────────
  const handleAddTask = async (title) => {
    try {
      setAdding(true);

      // Send the new task title to the backend
      const response = await axios.post(`${API_URL}/tasks`, { title });

      // Add the returned task (with its real id from the DB) to the front of the list
      setTasks(prev => [response.data, ...prev]);

      // Show a success notification
      toast.success('Task added!');
    } catch (err) {
      console.error('Failed to add task:', err);
      toast.error('Failed to add task. Please try again.');
    } finally {
      setAdding(false);
    }
  };

  // ─────────────────────────────────────────────
  // PUT /tasks/:id — Edit a task's title
  // ─────────────────────────────────────────────
  const handleEditTask = async (id, newTitle, completed) => {
    try {
      // Send the updated title and current completed status to the backend
      const response = await axios.put(`${API_URL}/tasks/${id}`, {
        title: newTitle,
        completed,
      });

      // Update the tasks array: replace the old task with the updated one
      setTasks(prev =>
        prev.map(task => task.id === id ? response.data : task)
      );

      toast.success('Task updated!');
    } catch (err) {
      console.error('Failed to edit task:', err);
      toast.error('Failed to update task.');
    }
  };

  // ─────────────────────────────────────────────
  // PUT /tasks/:id — Toggle the completed status
  // ─────────────────────────────────────────────
  const handleToggleTask = async (id, title, currentCompleted) => {
    try {
      // Flip the completed value
      const response = await axios.put(`${API_URL}/tasks/${id}`, {
        title,
        completed: !currentCompleted,
      });

      // Update the specific task in state
      setTasks(prev =>
        prev.map(task => task.id === id ? response.data : task)
      );

      // Different messages for checking vs unchecking
      toast.success(
        response.data.completed ? 'Task completed! 🎉' : 'Task marked incomplete.'
      );
    } catch (err) {
      console.error('Failed to toggle task:', err);
      toast.error('Failed to update task.');
    }
  };

  // ─────────────────────────────────────────────
  // DELETE /tasks/:id — Delete a task
  // ─────────────────────────────────────────────
  const handleDeleteTask = async (id) => {
    // Ask for confirmation before deleting
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      // Send delete request to the backend
      await axios.delete(`${API_URL}/tasks/${id}`);

      // Remove the deleted task from state using filter
      setTasks(prev => prev.filter(task => task.id !== id));

      toast.success('Task deleted.');
    } catch (err) {
      console.error('Failed to delete task:', err);
      toast.error('Failed to delete task.');
    }
  };

  // ─────────────────────────────────────────────
  // Render the UI
  // ─────────────────────────────────────────────
  return (
    <>
      {/* Toaster renders the pop-up notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#21253a',
            color: '#e8eaf0',
            border: '1px solid #2e3450',
            fontFamily: 'Sora, sans-serif',
            fontSize: '0.88rem',
          },
        }}
      />

      <div className="app-wrapper">
        <div className="app-container">

          {/* ─── Header ─── */}
          <header className="app-header">
            <h1>✦ Task Manager</h1>
            <p>Stay organised. Stay focused.</p>
          </header>

          {/* ─── Add Task Form ─── */}
          <TaskForm onAdd={handleAddTask} loading={adding} />

          {/* ─── Task List ─── */}
          <TaskList
            tasks={tasks}
            loading={loading}
            error={error}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onToggle={handleToggleTask}
          />

          {/* ─── Footer ─── */}
          <footer className="app-footer">
            <p>todo-app · React + Express + PostgreSQL</p>
          </footer>
        </div>
      </div>
    </>
  );
}

export default App;
