import type { Task } from "../services/taskService";
import "./TaskDetailModal.css";

type TaskDetailModalProps = {
  task: Task;
  onClose: () => void;
};

export function TaskDetailModal({ task, onClose }: TaskDetailModalProps) {
  const assigneeLabel =
    task.profile?.full_name || task.profile?.username || null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal-small" onClick={(e) => e.stopPropagation()}>
        <h3>{task.title}</h3>

        <div className="task-detail-body">
          {task.description && (
            <p className="task-detail-description">{task.description}</p>
          )}

          <div className="task-detail-meta">
            {task.priority && (
              <div className="task-detail-row">
                <span className="task-detail-label">Priority</span>
                <span
                  className={`task-card-priority priority-${task.priority.toLowerCase()}`}
                >
                  {task.priority}
                </span>
              </div>
            )}

            {task.due_date && (
              <div className="task-detail-row">
                <span className="task-detail-label">Due date</span>
                <span>{task.due_date}</span>
              </div>
            )}

            <div className="task-detail-row">
              <span className="task-detail-label">Assignee</span>
              {assigneeLabel ? (
                <span className="task-detail-assignee">
                  {task.profile?.avatar_url ? (
                    <img
                      src={task.profile.avatar_url}
                      alt=""
                      className="task-detail-assignee-avatar"
                    />
                  ) : (
                    <span className="member-picker-avatar-fallback">
                      {assigneeLabel.charAt(0).toUpperCase()}
                    </span>
                  )}
                  {assigneeLabel}
                </span>
              ) : (
                <span className="task-detail-unassigned">Unassigned</span>
              )}
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button className="modal-btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}