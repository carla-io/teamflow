import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { useDashboard } from "../contexts/DashboardContext";
import {
  IconDashboard,
  IconWorkspaces,
  IconProjects,
  IconTasks,
  IconMembers,
  IconCalendar,
  IconSettings,
  IconLogout,
  IconSearch,
  IconBell,
} from "./icons";
import "./DashboardLayout.css";
import { ThemeToggle } from "../components/ThemeToggle";

const navItems = [
  { to: "/", label: "Dashboard", icon: IconDashboard, end: true },
  { to: "/workspaces", label: "Workspaces", icon: IconWorkspaces },
  { to: "/projects", label: "Projects", icon: IconProjects },
  { to: "/tasks", label: "My Tasks", icon: IconTasks },
  { to: "/members", label: "Members", icon: IconMembers },
  { to: "/calendar", label: "Calendar", icon: IconCalendar },
  { to: "/settings", label: "Settings", icon: IconSettings },
];

interface DashboardLayoutProps {
  pageTitle: string;
  children: ReactNode;
}

export function DashboardLayout({ pageTitle, children }: DashboardLayoutProps) {
  const { profile, firstName, loading, signOut } = useDashboard();

  if (loading) {
    return (
      <div className="console-loading">
        <span className="cursor-blink" />
        <p>booting session…</p>
      </div>
    );
  }

  return (
    <div className="console">
      <aside className="console-sidebar">
        <div className="console-logo">
          <span className="console-logo-mark">▍</span>
          <span className="console-logo-label">TeamFlow</span>
        </div>
        <nav className="console-nav">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={label}
              to={to}
              end={end}
              className={({ isActive }) => `console-nav-item${isActive ? " is-active" : ""}`}
            >
              <Icon className="console-nav-icon" />
              <span className="console-nav-label">{label}</span>
            </NavLink>
          ))}
        </nav>
        <button className="console-nav-item console-logout" onClick={signOut}>
          <IconLogout className="console-nav-icon" />
          <span className="console-nav-label">Logout</span>
        </button>
      </aside>

      <div className="console-main">
        <header className="console-topbar">
          <label className="console-search">
            <IconSearch className="console-search-icon" />
            <input type="text" placeholder="Search…" />
          </label>
          <div className="console-topbar-right">
  <ThemeToggle />
  <button className="console-icon-btn" aria-label="Notifications">
    <IconBell />
  </button>
  <span className="console-user">
    {profile?.avatar_url ? (
      <img className="console-avatar" src={profile.avatar_url} alt="" />
    ) : (
      <span className="console-avatar console-avatar-fallback">
        {firstName.charAt(0).toUpperCase()}
      </span>
    )}
    {firstName}
  </span>
</div>
        </header>

        <main className="console-content">
          <h1 className="console-page-title">
            {pageTitle}
            <span className="cursor-blink" />
          </h1>
          {children}
        </main>
      </div>
    </div>
  );
}