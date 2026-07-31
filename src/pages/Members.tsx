import { useState } from "react";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { IconMembers, IconPlus } from "../layouts/icons";
import "./Members.css";

type MemberRole = "owner" | "admin" | "member";

interface Member {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
  avatarUrl?: string;
}

// Placeholder data — swap for a real fetch once the members query exists.
const mockMembers: Member[] = [
  { id: "1", name: "Carla", email: "carla@teamflow.io", role: "owner" },
  { id: "2", name: "John", email: "john@teamflow.io", role: "admin" },
  { id: "3", name: "Maria", email: "maria@teamflow.io", role: "member" },
  { id: "4", name: "Diego", email: "diego@teamflow.io", role: "member" },
  { id: "5", name: "Priya", email: "priya@teamflow.io", role: "member" },
  { id: "6", name: "Sam", email: "sam@teamflow.io", role: "admin" },
];

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
  const [members] = useState<Member[]>(mockMembers);

  return (
    <DashboardLayout pageTitle="Members">
      <div className="members-header">
        <p className="eyebrow">All Members</p>
        <button className="workspaces-new-btn">
          <IconPlus />
          Invite Member
        </button>
      </div>

      <div className="members-grid">
        {members.map((m) => (
          <div key={m.id} className="frame member-card">
            {m.avatarUrl ? (
              <img className="member-card-avatar" src={m.avatarUrl} alt="" />
            ) : (
              <span className="member-card-avatar member-card-avatar-fallback">
                {m.name.charAt(0).toUpperCase()}
              </span>
            )}
            <div className="member-card-info">
              <h3 className="member-card-name">{m.name}</h3>
              <p className="member-card-email">{m.email}</p>
            </div>
            <span className={`member-card-role ${roleClass[m.role]}`}>
              {roleLabel[m.role]}
            </span>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}