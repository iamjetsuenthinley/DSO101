// frontend/src/components/TaskItem.jsx

// TaskItem renders a single task row with:
// - A checkbox to toggle completion
// - The task title (or an edit input when editing)
// - Edit, Save, Cancel, and Delete buttons

import { useState } from 'react';

// Props:
//   task    — the task object { id, title, completed, created_at }
//   onEdit   — function to call when saving an edit
//   onDelete — function to call when deleting
//   onToggle — function to call when checking/unchecking
function TaskItem({ task, onEdit, onDelete, onToggle }) {
  // Track whether this task is currently in edit mode
  const [isEditing, setIsEditing] = useState(false);

  // The value shown in the edit input field
  const [editValue, setEditValue] = useState(task.title);

  // Handle saving an edited task
  const handleSave = async () => {
    // Don't allow saving an empty title
    if (!editValue.trim()) return;

    // Call the parent's edit function with the task id and new title
    await onEdit(task.id, editValue.trim(), task.completed);

    // Exit edit mode
    setIsEditing(false);
  };

  // Handle cancelling an edit — restore original title and exit edit mode
  const handleCancel = () => {
    setEditValue(task.title);
    setIsEditing(false);
  };

  // Allow pressing Enter to save and Escape to cancel when editing
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') handleCancel();
  };

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      {/* Checkbox — toggles the completed state */}
      <input
        type="checkbox"
        className="task-checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id, task.title, task.completed)}
      />

      {/* Conditionally render either an edit input or the task title */}
      {isEditing ? (
        // ─── Edit Mode ───
        <input
          type="text"
          className="task-edit-input"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          maxLength={255}
        />
      ) : (
        // ─── View Mode ───
        <span className={`task-title ${task.completed ? 'done' : ''}`}>
          {task.title}
        </span>
      )}

      {/* Action buttons — change depending on edit mode */}
      <div className="task-actions">
        {isEditing ? (
          // Edit mode: show Save and Cancel
          <>
            <button className="btn btn-sm btn-save" onClick={handleSave}>
              Save
            </button>
            <button className="btn btn-sm btn-cancel" onClick={handleCancel}>
              Cancel
            </button>
          </>
        ) : (
          // View mode: show Edit and Delete
          <>
            <button
              className="btn btn-sm btn-edit"
              onClick={() => setIsEditing(true)}
              disabled={task.completed}    // Don't allow editing completed tasks
              title={task.completed ? 'Uncheck to edit' : 'Edit task'}
            >
              Edit
            </button>
            <button
              className="btn btn-sm btn-delete"
              onClick={() => onDelete(task.id)}
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default TaskItem;