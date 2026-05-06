// frontend/src/components/TaskForm.jsx

// TaskForm handles adding new tasks.
// It renders the input field and the "Add Task" button.

import { useState } from 'react';

// Props:
//   onAdd — a function passed from App.jsx that actually saves the task
//   loading — boolean that disables the button while the API call is in progress
function TaskForm({ onAdd, loading }) {
  // 'title' is the controlled input state — React tracks what's typed in the box
  const [title, setTitle] = useState('');

  // This runs when the form is submitted (button clicked or Enter pressed)
  const handleSubmit = async (e) => {
    // Prevent the default browser form submission (which would reload the page)
    e.preventDefault();

    // Trim whitespace; don't submit if input is empty
    if (!title.trim()) return;

    // Call the parent function to add the task
    await onAdd(title.trim());

    // Clear the input field after successful submission
    setTitle('');
  };

  return (
    // The 'card' class applies the styled container from index.css
    <div className="card">
      {/* Using a <form> element allows pressing Enter to submit */}
      <form className="task-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="task-input"
          placeholder="What needs to be done?"
          value={title}              // Controlled: always shows the current state
          onChange={(e) => setTitle(e.target.value)}  // Updates state on every keystroke
          disabled={loading}         // Disable input while request is in-flight
          maxLength={255}            // Match our database VARCHAR(255) limit
          autoFocus                  // Auto-focus when the page loads
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || !title.trim()}  // Disable if loading or input is empty
        >
          {/* Show different text depending on loading state */}
          {loading ? '...' : '+ Add Task'}
        </button>
      </form>
    </div>
  );
}

export default TaskForm;