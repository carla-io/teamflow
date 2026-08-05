import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { IconProjects, IconPlus } from "../layouts/icons";
import { useWorkspaces } from "../hooks/useWorkspaces";
import {
  useProjects,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
} from "../hooks/useProjects";
import type { Project } from "../services/projectService";
import "./Projects.css";

export function Projects() {
  const { data: workspaces, isLoading: workspacesLoading } = useWorkspaces();
  const [workspaceId, setWorkspaceId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!workspaceId && workspaces && workspaces.length > 0) {
      setWorkspaceId(workspaces[0].id);
    }
  }, [workspaces, workspaceId]);

  const { data: projects, isLoading, isError, error } = useProjects(workspaceId);
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

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

  function openCreateModal() {
    setModalMode("create");
    setName("");
    setDescription("");
  }

  function openEditModal(p: Project) {
    setModalMode("edit");
    setActiveProject(p);
    setName(p.name);
    setDescription(p.description ?? "");
    setOpenMenuId(null);
  }

  function closeModal() {
    setModalMode(null);
    setActiveProject(null);
    setName("");
    setDescription("");
  }

  async function handleSubmit() {
    if (!name.trim() || !workspaceId) return;

    try {
      if (modalMode === "edit" && activeProject) {
        await updateProject.mutateAsync({
          projectId: activeProject.id,
          name: name.trim(),
          description: description.trim() || undefined,
        });
      } else {
        await createProject.mutateAsync({
          workspaceId,
          name: name.trim(),
          description: description.trim() || undefined,
        });
      }
      closeModal();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteProject.mutateAsync(id);
      setConfirmDeleteId(null);
    } catch (err) {
      console.error(err);
    }
  }

  const isSaving = createProject.isPending || updateProject.isPending;
  const saveError = createProject.error || updateProject.error;

  return (
    <DashboardLayout pageTitle="Projects">
      <div className="projects-header">
        <p className="eyebrow">All Projects</p>

        <div className="projects-header-actions">
          <select
            className="workspace-select"
            value={workspaceId ?? ""}
            onChange={(e) => setWorkspaceId(e.target.value)}
            disabled={workspacesLoading || !workspaces?.length}
          >
            {workspaces?.map((ws) => (
              <option key={ws.id} value={ws.id}>
                {ws.name}
              </option>
            ))}
          </select>

          <button
            className="workspaces-new-btn"
            onClick={openCreateModal}
            disabled={!workspaceId}
          >
            <IconPlus />
            New Project
          </button>
        </div>
      </div>

      {isLoading && <p>Loading projects…</p>}

      {isError && (
        <p className="error-text">
          Failed to load projects{error instanceof Error ? `: ${error.message}` : ""}
        </p>
      )}

      {!isLoading && !isError && projects?.length === 0 && (
        <p>No projects in this workspace yet — create your first one.</p>
      )}

      {!isLoading && !isError && projects && projects.length > 0 && (
        <div className="frame projects-table">
          <div className="projects-row projects-row-head">
            <span>Project</span>
            <span>Description</span>
            <span>Created</span>
            <span></span>
          </div>

          {projects.map((p) => (
            <div key={p.id} className="projects-row">
              <Link to={`/projects/${p.id}`} className="projects-name">
                <IconProjects className="projects-name-icon" />
                {p.name}
              </Link>
              <span className="projects-workspace">{p.description || "—"}</span>
              <span className="projects-due">
                {new Date(p.created_at).toLocaleDateString()}
              </span>

              <span
                className="workspace-card-menu-wrap"
                ref={openMenuId === p.id ? menuRef : null}
              >
                <button
                  className="workspace-card-menu-btn"
                  onClick={() => setOpenMenuId(openMenuId === p.id ? null : p.id)}
                  aria-label="Project options"
                >
                  ⋯
                </button>

                {openMenuId === p.id && (
                  <div className="workspace-card-menu">
                    <button onClick={() => openEditModal(p)}>Edit</button>
                    <button
                      className="danger"
                      onClick={() => {
                        setConfirmDeleteId(p.id);
                        setOpenMenuId(null);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </span>
            </div>
          ))}
        </div>
      )}

      {modalMode && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{modalMode === "edit" ? "Edit Project" : "New Project"}</h3>

            <input
              className="modal-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Project name"
              autoFocus
            />

            <textarea
              className="modal-input modal-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)"
              rows={3}
            />

            {saveError && (
              <p className="error-text">
                {saveError instanceof Error ? saveError.message : "Something went wrong"}
              </p>
            )}

            <div className="modal-actions">
              <button className="modal-btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button
                className="modal-btn-primary"
                onClick={handleSubmit}
                disabled={isSaving || !name.trim()}
              >
                {isSaving ? "Saving…" : modalMode === "edit" ? "Save" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDeleteId && (
        <div className="modal-backdrop" onClick={() => setConfirmDeleteId(null)}>
          <div className="modal modal-small" onClick={(e) => e.stopPropagation()}>
            <h3>Delete project?</h3>
            <p className="modal-subtext">This can't be undone.</p>

            <div className="modal-actions">
              <button className="modal-btn-secondary" onClick={() => setConfirmDeleteId(null)}>
                Cancel
              </button>
              <button
                className="modal-btn-danger"
                onClick={() => handleDelete(confirmDeleteId)}
                disabled={deleteProject.isPending}
              >
                {deleteProject.isPending ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}