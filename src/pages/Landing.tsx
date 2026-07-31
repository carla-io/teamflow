import { DashboardLayout } from "../layouts/DashboardLayout";
import { useDashboard } from "../contexts/DashboardContext";
import "./Landing.css";

const recentActivity = [
  "John completed Login Page",
  "Carla created Mobile App Project",
  "Maria commented on Task #12",
];

const myTasks = [
  { name: "Design Login UI", priority: "High", due: "Tomorrow" },
  { name: "Connect Supabase", priority: "Medium", due: "Today" },
  { name: "Fix Authentication", priority: "High", due: "Friday" },
];

const stats = [
  { label: "Projects", value: 4 },
  { label: "Tasks", value: 12 },
  { label: "Due Soon", value: 3 },
  { label: "Members", value: 6 },
];

export function Landing() {
  const { firstName } = useDashboard();

  return (
    <DashboardLayout pageTitle="Dashboard">
      <p className="dash-welcome">Welcome back, {firstName}.</p>

      <section>
        <p className="eyebrow">Quick Stats</p>
        <div className="dash-stats-grid">
          {stats.map((stat) => (
            <div className="frame dash-stat-card" key={stat.label}>
              <span className="dash-stat-value">{stat.value}</span>
              <span className="dash-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="dash-columns">
        <section>
          <p className="eyebrow">Recent Activity</p>
          <ul className="frame dash-activity-list">
            {recentActivity.map((item, i) => (
              <li key={i}>
                <span className="dash-activity-dot" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <p className="eyebrow">My Tasks</p>
          <div className="frame dash-tasks-card">
            <table className="dash-tasks-table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Priority</th>
                  <th>Due</th>
                </tr>
              </thead>
              <tbody>
                {myTasks.map((task) => (
                  <tr key={task.name}>
                    <td>{task.name}</td>
                    <td>
                      <span className={`priority-badge priority-${task.priority.toLowerCase()}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="dash-due">{task.due}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}