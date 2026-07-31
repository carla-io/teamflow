import { useState } from "react";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { IconWorkspaces, IconPlus, IconMembers } from "../layouts/icons";

interface Workspace {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  projectCount: number;
}

// Placeholder data — swap for a real fetch (e.g. via supabase.ts) once
// the workspaces table/query is wired up.
const mockWorkspaces: Workspace[] = [
  { id: "1", name: "Mobile App Project", description: "TeamFlow's cross-platform app rebuild", memberCount: 6, projectCount: 3 },
  { id: "2", name: "Marketing Site", description: "Public site + landing pages", memberCount: 3, projectCount: 2 },
  { id: "3", name: "Internal Tools", description: "Admin dashboards and scripts", memberCount: 4, projectCount: 5 },
  { id: "4", name: "Design System", description: "Shared tokens, icons, components", memberCount: 2, projectCount: 1 },
];

export function Workspaces() {
  const [workspaces] = useState<Workspace[]>(mockWorkspaces);

  return (
    <DashboardLayout pageTitle="Workspaces">
      <div className="workspaces-header">
        <p className="eyebrow">All Workspaces</p>
        <button className="workspaces-new-btn">
          <IconPlus />
          New Workspace
        </button>
      </div>

      <div className="workspaces-grid">
        {workspaces.map((ws) => (
          <div key={ws.id} className="frame workspace-card">
            <div className="workspace-card-icon">
              <IconWorkspaces />
            </div>
            <h3 className="workspace-card-title">{ws.name}</h3>
            <p className="workspace-card-desc">{ws.description}</p>
            <div className="workspace-card-footer">
              <span className="workspace-card-stat">
                <IconMembers className="workspace-card-stat-icon" />
                {ws.memberCount}
              </span>
              <span className="workspace-card-stat">{ws.projectCount} projects</span>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}