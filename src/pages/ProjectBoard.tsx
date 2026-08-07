import { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { useProject } from "../hooks/useProjects";
import {
  useColumns,
  useCreateColumn,
  useUpdateColumn,
  useDeleteColumn,
} from "../hooks/useColumns";
import { useTasksByColumn } from "../hooks/useTasks";
import { CreateTaskModal } from "./CreateTaskModal";
import { IconPlus } from "../layouts/icons";
import "./ProjectBoard.css";

function ColumnTasks({ columnId }: { columnId: string }) {
  const { data: tasks, isLoading } = useTasksByColumn(columnId);

  if (isLoading) return null;
  if (!tasks || tasks.length === 0) return null;

  return (
    <>
      {tasks.map((task) => (
        <div key={task.id} className="task-card">
          <p className="task-card-title">{task.title}</p>
          {task.priority && (
            <span className={`task-card-priority priority-${task.priority.toLowerCase()}`}>
              {task.priority}
            </span>
          )}
          {task.due_date && <span className="task-card-due">{task.due_date}</span>}
        </div>
      ))}
    </>
  );
}

export function ProjectBoard() {
  const { id: projectId } = useParams<{ id: string }>();
  const { data: project } = useProject(projectId);
  const { data: columns, isLoading, isError, error } = useColumns(projectId);

  const createColumn = useCreateColumn();
  const updateColumn = useUpdateColumn();
  const deleteColumn = useDeleteColumn();

  const [addingColumn, setAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [editingColumnId, setEditingColumnId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [addingTaskColumnId, setAddingTaskColumnId] = useState<string | null>(null);

  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleAddColumn() {
    if (!newColumnTitle.trim() || !projectId) return;

    const position = columns?.length ?? 0;

    try {
      await createColumn.mutateAsync({
        projectId,
        title: newColumnTitle.trim(),
        position,
      });
      setNewColumnTitle("");
      setAddingColumn(false);
    } catch (err) {
      console.error(err);
    }
  }

  function startEditing(columnId: string, currentTitle: string) {
    setEditingColumnId(columnId);
    setEditingTitle(currentTitle);
    setOpenMenuId(null);
  }

  async function saveEdit() {
    if (!editingColumnId || !editingTitle.trim() || !projectId) return;
    try {
      await updateColumn.mutateAsync({
        columnId: editingColumnId,
        projectId,
        updates: { title: editingTitle.trim() },
      });
      setEditingColumnId(null);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDeleteColumn(columnId: string) {
    if (!projectId) return;
    try {
      await deleteColumn.mutateAsync({ columnId, projectId });
      setConfirmDeleteId(null);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <DashboardLayout pageTitle={project?.name ?? "Project"}>
      <div className="board-header">
        <Link to="/projects" className="board-back-link">
          ← All Projects
        </Link>
        <p className="eyebrow">{project?.name ?? "Loading…"}</p>
      </div>

      {isLoading && <p>Loading board…</p>}

      {isError && (
        <p className="error-text">
          Failed to load columns{error instanceof Error ? `: ${error.message}` : ""}
        </p>
      )}

      {!isLoading && !isError && (
        <div className="board-columns">
          {columns?.map((col) => (
            <div key={col.id} className="board-column">
              <div className="board-column-header">
                {editingColumnId === col.id ? (
                  <input
                    className="board-column-title-input"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onBlur={saveEdit}
                    onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                    autoFocus
                  />
                ) : (
                  <span className="board-column-title">
                    {(col.title ?? "Untitled").toUpperCase()}
                  </span>
                )}

                <span
                  className="workspace-card-menu-wrap"
                  ref={openMenuId === col.id ? menuRef : null}
                >
                  <button
                    className="board-column-menu-btn"
                    onClick={() => setOpenMenuId(openMenuId === col.id ? null : col.id)}
                    aria-label="Column options"
                  >
                    ⋯
                  </button>

                  {openMenuId === col.id && (
                    <div className="workspace-card-menu">
                      <button onClick={() => startEditing(col.id, col.title ?? "")}>
                        Rename
                      </button>
                      <button
                        className="danger"
                        onClick={() => {
                          setConfirmDeleteId(col.id);
                          setOpenMenuId(null);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </span>
              </div>

              <div className="board-column-tasks">
                <ColumnTasks columnId={col.id} />
              </div>

              <button
                className="board-add-task"
                onClick={() => setAddingTaskColumnId(col.id)}
              >
                + Add Task
              </button>
            </div>
          ))}

          <div className="board-column board-column-new">
            {addingColumn ? (
              <div className="board-add-column-form">
                <input
                  className="board-column-title-input"
                  value={newColumnTitle}
                  onChange={(e) => setNewColumnTitle(e.target.value)}
                  placeholder="Column title"
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && handleAddColumn()}
                />
                <div className="board-add-column-actions">
                  <button onClick={handleAddColumn} disabled={createColumn.isPending}>
                    {createColumn.isPending ? "Adding…" : "Add"}
                  </button>
                  <button onClick={() => setAddingColumn(false)}>Cancel</button>
                </div>
              </div>
            ) : (
              <button className="board-add-column-btn" onClick={() => setAddingColumn(true)}>
                <IconPlus />
                Add Column
              </button>
            )}
          </div>
        </div>
      )}

      {/* Add task modal */}
      {addingTaskColumnId && (
        <CreateTaskModal
          columnId={addingTaskColumnId}
          onClose={() => setAddingTaskColumnId(null)}
        />
      )}

      {/* Delete confirmation */}
      {confirmDeleteId && (
        <div className="modal-backdrop" onClick={() => setConfirmDeleteId(null)}>
          <div className="modal modal-small" onClick={(e) => e.stopPropagation()}>
            <h3>Delete column?</h3>
            <p className="modal-subtext">Tasks inside it will need to be moved first.</p>

            <div className="modal-actions">
              <button className="modal-btn-secondary" onClick={() => setConfirmDeleteId(null)}>
                Cancel
              </button>
              <button
                className="modal-btn-danger"
                onClick={() => handleDeleteColumn(confirmDeleteId)}
                disabled={deleteColumn.isPending}
              >
                {deleteColumn.isPending ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}