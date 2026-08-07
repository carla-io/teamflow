import { useState } from "react";
import { useCreateTask } from "../hooks/useTasks";

type Priority = "Low" | "Medium" | "High";

type CreateTaskModalProps = {
  columnId: string;
  onClose: () => void;
};

const PRIORITIES: Priority[] = ["Low", "Medium", "High"];

export function CreateTaskModal({ columnId, onClose }: CreateTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [dueDate, setDueDate] = useState("");
  const [assignee, setAssignee] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { mutate: createTask, isPending } = useCreateTask();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    createTask(
      {
        column_id: columnId,
        title: title.trim(),
        description: description.trim() || null,
        priority,
        due_date: dueDate || null,
        assignee: assignee || null,
      },
      {
        onSuccess: () => onClose(),
        onError: (err) => setError(err.message),
      },
    );
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal-small" onClick={(e) => e.stopPropagation()}>
        <h3>Create Task</h3>

        <form onSubmit={handleSubmit} className="task-form">
          <label className="task-form-label">
            Title
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Fix mobile navbar"
              className="task-form-input"
            />
          </label>

          <label className="task-form-label">
            Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Make the navbar responsive"
              rows={3}
              className="task-form-input"
            />
          </label>

          <div className="task-form-row">
            <label className="task-form-label">
              Priority
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="task-form-input"
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </label>

            <label className="task-form-label">
              Due date
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="task-form-input"
              />
            </label>
          </div>

          <label className="task-form-label">
            Assignee
            <input
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              placeholder="Select member"
              className="task-form-input"
            />
          </label>

          {error && <p className="error-text">{error}</p>}

          <div className="modal-actions">
            <button
              type="button"
              className="modal-btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="modal-btn-primary"
              disabled={isPending}
            >
              {isPending ? "Creating…" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
