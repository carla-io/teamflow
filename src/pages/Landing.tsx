import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "./Landing.css";

interface Profile {
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
}

const sidebarItems = [
  { label: "Dashboard", icon: "🏠" },
  { label: "Workspaces", icon: "🗂️" },
  { label: "Projects", icon: "📁" },
  { label: "My Tasks", icon: "📋" },
  { label: "Members", icon: "👥" },
  { label: "Calendar", icon: "📅" },
  { label: "Settings", icon: "⚙️" },
];

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

export function Landing() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("full_name, username, avatar_url")
        .eq("id", user.id)
        .maybeSingle();

      setProfile(profileData);
      setLoading(false);
    };

    loadUser();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <p>Loading…</p>
      </div>
    );
  }

  const firstName = profile?.full_name?.split(" ")[0] ?? "there";

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-logo">TeamFlow</div>
        <nav className="sidebar-nav">
          {sidebarItems.map((item) => (
            <button key={item.label} className="sidebar-item">
              <span className="sidebar-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <button className="sidebar-item sidebar-logout" onClick={handleSignOut}>
          <span className="sidebar-icon">🚪</span>
          Logout
        </button>
      </aside>

      <div className="dashboard-main">
        <header className="topbar">
          <div className="topbar-search">
            <span>🔍</span>
            <input type="text" placeholder="Search…" />
          </div>
          <div className="topbar-right">
            <span className="topbar-icon">🔔</span>
            <span className="topbar-user">
              {profile?.avatar_url ? (
                <img className="topbar-avatar" src={profile.avatar_url} alt="" />
              ) : (
                "👤"
              )}{" "}
              {firstName}
            </span>
          </div>
        </header>

        <main className="dashboard-content">
          <h1 className="welcome-heading">Welcome back, {firstName} 👋</h1>

          <section>
            <h2 className="section-title">Quick Stats</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-label">Projects</span>
                <span className="stat-value">4</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Tasks</span>
                <span className="stat-value">12</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Due Soon</span>
                <span className="stat-value">3</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Members</span>
                <span className="stat-value">6</span>
              </div>
            </div>
          </section>

          <div className="dashboard-columns">
            <section>
              <h2 className="section-title">Recent Activity</h2>
              <ul className="activity-list">
                {recentActivity.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="section-title">My Tasks</h2>
              <table className="tasks-table">
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
                      <td>{task.due}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}