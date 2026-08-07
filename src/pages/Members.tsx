import { useState, useRef, useEffect, type FormEvent } from "react";
import { useParams } from "react-router-dom";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { IconMembers, IconPlus } from "../layouts/icons";
import {
  useWorkspaceMembers,
  useAddWorkspaceMember,
  useRemoveWorkspaceMember,
  useUpdateWorkspaceMemberRole,
} from "../hooks/useWorkspaceMembers";
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
  const { workspaceId } = useParams<{ workspaceId: string }>();

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

  const selectedProfile = profiles?.find((p) => p.id === selectedUserId);

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
  console.log("handleInvite fired", { workspaceId, selectedUserId });
  if (!workspaceId || !selectedUserId) {
    console.log("blocked by guard clause");
    return;
  }

  addMember.mutate(
    { workspaceId, userId: selectedUserId, role },
    {
      onSuccess: (data) => {
        console.log("add success", data);
        setSelectedUserId("");
        setSearch("");
        setRole("member");
        setIsInviteOpen(false);
      },
      onError: (err) => {
        console.log("add error", err);
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
        <button
          className="workspaces-new-btn"
          onClick={() => setIsInviteOpen((open) => !open)}
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

      {/* ... rest of the component (loading/error/members-grid) stays the same ... */}
    </DashboardLayout>
  );
}