// frontend/src/components/TaskList.jsx

// TaskList renders the list of tasks, or appropriate empty/loading/error states.
// It acts as a container that maps over the tasks array and renders TaskItem for each.

import TaskItem from './TaskItem';

// Props:
//   tasks    — array of task objects from the database
//   loading  — boolean (true while initial data is being fetched)
//   error    — string error message, or null if no error
//   onEdit   — passed through to TaskItem
//   onDelete — passed through to TaskItem
//   onToggle — passed through to TaskItem
function TaskList({ tasks, loading, error, onEdit, onDelete, onToggle }) {

  // ─── Loading State ───
  // Show a spinner while we're waiting for the API to respond
  if (loading) {
    return (
      <div className="card">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading your tasks...</p>
        </div>
      </div>
    );
  }

  // ─── Error State ───
  // Show an error message if the API call failed
  if (error) {
    return (
      <div className="card">
        <div className="error-state">
          ⚠️ {error}
        </div>
      </div>
    );
  }

  // ─── Empty State ───
  // Show a friendly message if there are no tasks yet
  if (tasks.length === 0) {
    return (
      <div className="card">
        <div className="empty-state">
          <span className="empty-icon">✅</span>
          <p>No tasks yet! Add one above to get started.</p>
        </div>
      </div>
    );
  }

  // Calculate stats for the progress bar
  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0
    ? Math.round((completedCount / totalCount) * 100)
    : 0;

  // ─── Task List ───
  return (
    <div className="card">
      {/* Stats bar showing completion progress */}
      <div className="task-stats">
        <span className="task-stats-label">
          {completedCount} of {totalCount} completed
        </span>
        <span className="task-stats-count">
          {progressPercent}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="progress-bar-container">
        <div
          className="progress-bar-fill"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Gap between stats and task list */}
      <div style={{ marginTop: '20px' }}>
        <div className="task-list">
          {/* Map over each task and render a TaskItem */}
          {tasks.map(task => (
            <TaskItem
              key={task.id}        // React needs a unique 'key' for list items
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggle={onToggle}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default TaskList;