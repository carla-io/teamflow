import { useState, useRef, useEffect } from "react";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { IconWorkspaces, IconPlus, IconMembers } from "../layouts/icons";
import {
  useWorkspaces,
  useCreateWorkspace,
  useUpdateWorkspace,
  useDeleteWorkspace,
} from "../hooks/useWorkspaces";
import type { Workspace } from "../services/workspaceService";

export function Workspaces() {
  const { data: workspaces, isLoading, isError, error } = useWorkspaces();
  const createWorkspace = useCreateWorkspace();
  const updateWorkspace = useUpdateWorkspace();
  const deleteWorkspace = useDeleteWorkspace();

  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(null);
  const [name, setName] = useState("");
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
  }

  function openEditModal(ws: Workspace) {
    setModalMode("edit");
    setActiveWorkspace(ws);
    setName(ws.name);
    setOpenMenuId(null);
  }

  function closeModal() {
    setModalMode(null);
    setActiveWorkspace(null);
    setName("");
  }

  async function handleSubmit() {
    if (!name.trim()) return;

    try {
      if (modalMode === "edit" && activeWorkspace) {
        await updateWorkspace.mutateAsync({ id: activeWorkspace.id, name: name.trim() });
      } else {
        await createWorkspace.mutateAsync(name.trim());
      }
      closeModal();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteWorkspace.mutateAsync(id);
      setConfirmDeleteId(null);
    } catch (err) {
      console.error(err);
    }
  }

  const isSaving = createWorkspace.isPending || updateWorkspace.isPending;
  const saveError = createWorkspace.error || updateWorkspace.error;

  return (
    <DashboardLayout pageTitle="Workspaces">
      <div className="workspaces-header">
        <p className="eyebrow">All Workspaces</p>
        <button className="workspaces-new-btn" onClick={openCreateModal}>
          <IconPlus />
          New Workspace
        </button>
      </div>

      {isLoading && <p>Loading workspaces…</p>}

      {isError && (
        <p className="error-text">
          Failed to load workspaces{error instanceof Error ? `: ${error.message}` : ""}
        </p>
      )}

      {!isLoading && !isError && workspaces?.length === 0 && (
        <p>No workspaces yet — create your first one.</p>
      )}

      {!isLoading && !isError && workspaces && workspaces.length > 0 && (
        <div className="workspaces-grid">
          {workspaces.map((ws) => (
            <div key={ws.id} className="frame workspace-card">
              <div className="workspace-card-top">
                <div className="workspace-card-icon">
                  <IconWorkspaces />
                </div>

                <div className="workspace-card-menu-wrap" ref={openMenuId === ws.id ? menuRef : null}>
                  <button
                    className="workspace-card-menu-btn"
                    onClick={() => setOpenMenuId(openMenuId === ws.id ? null : ws.id)}
                    aria-label="Workspace options"
                  >
                    ⋯
                  </button>

                  {openMenuId === ws.id && (
                    <div className="workspace-card-menu">
                      <button onClick={() => openEditModal(ws)}>Edit</button>
                      <button
                        className="danger"
                        onClick={() => {
                          setConfirmDeleteId(ws.id);
                          setOpenMenuId(null);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <h3 className="workspace-card-title">{ws.name}</h3>
              <p className="workspace-card-desc">
                Created {new Date(ws.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit modal */}
      {modalMode && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{modalMode === "edit" ? "Rename Workspace" : "New Workspace"}</h3>

            <input
              className="modal-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Workspace name"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
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

      {/* Delete confirmation */}
      {confirmDeleteId && (
        <div className="modal-backdrop" onClick={() => setConfirmDeleteId(null)}>
          <div className="modal modal-small" onClick={(e) => e.stopPropagation()}>
            <h3>Delete workspace?</h3>
            <p className="modal-subtext">This can't be undone.</p>

            <div className="modal-actions">
              <button className="modal-btn-secondary" onClick={() => setConfirmDeleteId(null)}>
                Cancel
              </button>
              <button
                className="modal-btn-danger"
                onClick={() => handleDelete(confirmDeleteId)}
                disabled={deleteWorkspace.isPending}
              >
                {deleteWorkspace.isPending ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}