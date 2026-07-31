import { useState } from "react";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { IconProjects, IconPlus, IconCalendar } from "../layouts/icons";
import "./Projects.css";

type ProjectStatus = "on-track" | "at-risk" | "delayed";

interface Project {
  id: string;
  name: string;
  workspace: string;
  status: ProjectStatus;
  dueDate: string;
  taskCount: number;
  completedCount: number;
}

// Placeholder data — swap for a real fetch once the projects query exists.
const mockProjects: Project[] = [
  { id: "1", name: "Mobile App Redesign", workspace: "Mobile App Project", status: "on-track", dueDate: "Aug 14", taskCount: 24, completedCount: 16 },
  { id: "2", name: "Landing Page Refresh", workspace: "Marketing Site", status: "at-risk", dueDate: "Aug 5", taskCount: 12, completedCount: 4 },
  { id: "3", name: "Admin Dashboard v2", workspace: "Internal Tools", status: "on-track", dueDate: "Aug 20", taskCount: 30, completedCount: 22 },
  { id: "4", name: "Icon Set Expansion", workspace: "Design System", status: "delayed", dueDate: "Jul 28", taskCount: 8, completedCount: 2 },
];

const statusLabel: Record<ProjectStatus, string> = {
  "on-track": "On Track",
  "at-risk": "At Risk",
  "delayed": "Delayed",
};

const statusClass: Record<ProjectStatus, string> = {
  "on-track": "status-low",
  "at-risk": "status-medium",
  "delayed": "status-high",
};

export function Projects() {
  const [projects] = useState<Project[]>(mockProjects);

  return (
    <DashboardLayout pageTitle="Projects">
      <div className="projects-header">
        <p className="eyebrow">All Projects</p>
        <button className="workspaces-new-btn">
          <IconPlus />
          New Project
        </button>
      </div>

      <div className="frame projects-table">
        <div className="projects-row projects-row-head">
          <span>Project</span>
          <span>Workspace</span>
          <span>Status</span>
          <span>Progress</span>
          <span>Due</span>
        </div>

        {projects.map((p) => (
          <div key={p.id} className="projects-row">
            <span className="projects-name">
              <IconProjects className="projects-name-icon" />
              {p.name}
            </span>
            <span className="projects-workspace">{p.workspace}</span>
            <span className={`projects-status-pill ${statusClass[p.status]}`}>
              {statusLabel[p.status]}
            </span>
            <span className="projects-progress">
              <span className="projects-progress-bar">
                <span
                  className="projects-progress-fill"
                  style={{ width: `${Math.round((p.completedCount / p.taskCount) * 100)}%` }}
                />
              </span>
              <span className="projects-progress-text">
                {p.completedCount}/{p.taskCount}
              </span>
            </span>
            <span className="projects-due">
              <IconCalendar className="projects-due-icon" />
              {p.dueDate}
            </span>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}