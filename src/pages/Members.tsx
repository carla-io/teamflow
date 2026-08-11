import { useState, useRef, useEffect, type FormEvent } from "react";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { IconMembers, IconPlus } from "../layouts/icons";
import {
  useWorkspaceMembers,
  useAddWorkspaceMember,
  useRemoveWorkspaceMember,
  useUpdateWorkspaceMemberRole,
} from "../hooks/useWorkspaceMembers";
import { useWorkspaces } from "../hooks/useWorkspaces";
import { useProfiles } from "../hooks/useProfiles";
import "./Members.css";

type MemberRole = "owner" | "admin" | "member";

const roleLabel: Record<MemberRole, string> = {
  owner: "Owner",
  admin: "Admin",
  member: "Member",
};

const roleClass: Record<MemberRole, string> = {
  owner: "status-medium",
  admin: "status-low",
  member: "",
};

export function Members() {
  // workspaceId comes from a selector (no route param for this page)
  const { data: workspaces } = useWorkspaces();
  const [workspaceId, setWorkspaceId] = useState<string>("");

  // Auto-select the first workspace once loaded, if none chosen yet
  useEffect(() => {
    if (!workspaceId && workspaces && workspaces.length > 0) {
      setWorkspaceId(workspaces[0].id);
    }
  }, [workspaces, workspaceId]);

  const { data: members, isLoading, isError, error } =
    useWorkspaceMembers(workspaceId);
  const { data: profiles } = useProfiles();

  const addMember = useAddWorkspaceMember();
  const removeMember = useRemoveWorkspaceMember();
  const updateRole = useUpdateWorkspaceMemberRole();

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [role, setRole] = useState<MemberRole>("member");
  const pickerRef = useRef<HTMLDivElement>(null);

  const existingUserIds = new Set(members?.map((m) => m.user_id));

  const filteredProfiles = (profiles ?? [])
    .filter((p) => !existingUserIds.has(p.id))
    .filter((p) => {
      const label = (p.full_name || p.username || "").toLowerCase();
      return label.includes(search.toLowerCase());
    });

  // Close the dropdown on outside click.
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setIsPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handlePick(profileId: string, label: string) {
    setSelectedUserId(profileId);
    setSearch(label);
    setIsPickerOpen(false);
  }

  function handleInvite(e: FormEvent) {
    e.preventDefault();
    if (!workspaceId || !selectedUserId) return;

    addMember.mutate(
      { workspaceId, userId: selectedUserId, role },
      {
        onSuccess: () => {
          setSelectedUserId("");
          setSearch("");
          setRole("member");
          setIsInviteOpen(false);
        },
      },
    );
  }

  function handleRemove(memberId: string) {
    if (!workspaceId) return;
    removeMember.mutate({ memberId, workspaceId });
  }

  function handleRoleChange(memberId: string, newRole: string) {
    updateRole.mutate({ memberId, role: newRole });
  }

  return (
    <DashboardLayout pageTitle="Members">
      <div className="members-header">
        <p className="eyebrow">All Members</p>

        {/* Workspace selector */}
        <select
          value={workspaceId}
          onChange={(e) => setWorkspaceId(e.target.value)}
          disabled={!workspaces || workspaces.length === 0}
        >
          {(workspaces ?? []).map((ws) => (
            <option key={ws.id} value={ws.id}>
              {ws.name}
            </option>
          ))}
        </select>

        <button
          className="workspaces-new-btn"
          onClick={() => setIsInviteOpen((open) => !open)}
          disabled={!workspaceId}
        >
          <IconPlus />
          Invite Member
        </button>
      </div>

      {isInviteOpen && (
        <form className="frame member-invite-form" onSubmit={handleInvite}>
          <div className="member-picker" ref={pickerRef}>
            <input
              type="text"
              placeholder="Search users…"
              value={search}
              onFocus={() => setIsPickerOpen(true)}
              onChange={(e) => {
                setSearch(e.target.value);
                setSelectedUserId("");
                setIsPickerOpen(true);
              }}
              autoComplete="off"
            />

            {isPickerOpen && (
              <div className="member-picker-dropdown">
                {filteredProfiles.length === 0 && (
                  <p className="member-picker-empty">No users found</p>
                )}
                {filteredProfiles.map((profile) => {
                  const label =
                    profile.full_name || profile.username || "Unnamed user";
                  return (
                    <button
                      type="button"
                      key={profile.id}
                      className="member-picker-option"
                      onClick={() => handlePick(profile.id, label)}
                    >
                      {profile.avatar_url ? (
                        <img src={profile.avatar_url} alt="" />
                      ) : (
                        <span className="member-picker-avatar-fallback">
                          {label.charAt(0).toUpperCase()}
                        </span>
                      )}
                      <span>{label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value as MemberRole)}
          >
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>

          <button
            type="submit"
            disabled={addMember.isPending || !selectedUserId}
          >
            {addMember.isPending ? "Adding…" : "Add"}
          </button>

          {addMember.isError && (
            <p className="member-invite-error">
              {(addMember.error as Error).message}
            </p>
          )}
        </form>
      )}

      {isLoading && <p>Loading members…</p>}

      {isError && (
        <p className="error-text">
          Failed to load members{error instanceof Error ? `: ${error.message}` : ""}
        </p>
      )}

      {!isLoading && !isError && members?.length === 0 && (
        <p>No members yet — invite someone to get started.</p>
      )}

      {!isLoading && !isError && members && members.length > 0 && (
        <div className="members-grid">
          {members.map((member) => {
            const label =
              member.profile?.full_name ||
              member.profile?.username ||
              "Unnamed user";
            const currentRole = member.role as MemberRole;

            return (
              <div key={member.id} className="frame member-card">
                <div className="member-card-top">
                  {member.profile?.avatar_url ? (
                    <img
                      src={member.profile.avatar_url}
                      alt=""
                      className="member-card-avatar"
                    />
                  ) : (
                    <span className="member-picker-avatar-fallback">
                      {label.charAt(0).toUpperCase()}
                    </span>
                  )}

                  <div className="member-card-info">
                    <p className="member-card-name">{label}</p>
                    {member.profile?.username && (
                      <p className="member-card-username">
                        @{member.profile.username}
                      </p>
                    )}
                  </div>
                </div>

                <div className="member-card-actions">
                  {currentRole === "owner" ? (
                    <span
                      className={`member-card-role ${roleClass[currentRole]}`}
                    >
                      {roleLabel[currentRole]}
                    </span>
                  ) : (
                    <select
                      className={`member-card-role ${roleClass[currentRole]}`}
                      value={currentRole}
                      onChange={(e) => handleRoleChange(member.id, e.target.value)}
                      disabled={updateRole.isPending}
                    >
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                    </select>
                  )}

                  {currentRole !== "owner" && (
                    <button
                      className="member-card-remove"
                      onClick={() => handleRemove(member.id)}
                      disabled={removeMember.isPending}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}