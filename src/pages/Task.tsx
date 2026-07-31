import { useState } from "react";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { IconTasks, IconPlus, IconCalendar } from "../layouts/icons";
import "./Task.css";

type TaskPriority = "high" | "medium" | "low";

interface Task {
  id: string;
  title: string;
  project: string;
  priority: TaskPriority;
  dueDate: string;
  done: boolean;
}

// Placeholder data — swap for a real fetch once the tasks query exists.
const mockTasks: Task[] = [
  { id: "1", title: "Design Login UI", project: "Mobile App Redesign", priority: "high", dueDate: "Tomorrow", done: false },
  { id: "2", title: "Connect Supabase", project: "Admin Dashboard v2", priority: "medium", dueDate: "Today", done: false },
  { id: "3", title: "Fix Authentication", project: "Mobile App Redesign", priority: "high", dueDate: "Friday", done: false },
  { id: "4", title: "Write onboarding copy", project: "Landing Page Refresh", priority: "low", dueDate: "Aug 6", done: false },
  { id: "5", title: "Review icon set PR", project: "Icon Set Expansion", priority: "medium", dueDate: "Aug 2", done: true },
];

const priorityLabel: Record<TaskPriority, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

const priorityClass: Record<TaskPriority, string> = {
  high: "status-high",
  medium: "status-medium",
  low: "status-low",
};

export function Tasks() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);

  function toggleTask(id: string) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }

  return (
    <DashboardLayout pageTitle="My Tasks">
      <div className="tasks-header">
        <p className="eyebrow">All Tasks</p>
        <button className="workspaces-new-btn">
          <IconPlus />
          New Task
        </button>
      </div>

      <div className="frame tasks-table">
        <div className="tasks-row tasks-row-head">
          <span></span>
          <span>Task</span>
          <span>Project</span>
          <span>Priority</span>
          <span>Due</span>
        </div>

        {tasks.map((t) => (
          <div key={t.id} className={`tasks-row${t.done ? " is-done" : ""}`}>
            <span className="tasks-checkbox-cell">
              <input
                type="checkbox"
                checked={t.done}
                onChange={() => toggleTask(t.id)}
                className="tasks-checkbox"
              />
            </span>
            <span className="tasks-name">
              <IconTasks className="tasks-name-icon" />
              {t.title}
            </span>
            <span className="tasks-project">{t.project}</span>
            <span className={`tasks-priority-pill ${priorityClass[t.priority]}`}>
              {priorityLabel[t.priority]}
            </span>
            <span className="tasks-due">
              <IconCalendar className="tasks-due-icon" />
              {t.dueDate}
            </span>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}