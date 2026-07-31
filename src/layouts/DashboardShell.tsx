import { Outlet } from "react-router-dom";
import { DashboardProvider } from "../contexts/DashboardContext";

/*
  Wrap every dashboard-area route with this at the router level, e.g.:

    <Route element={<DashboardShell />}>
      <Route path="/" element={<Landing />} />
      <Route path="/workspaces" element={<Workspaces />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/tasks" element={<Tasks />} />
      <Route path="/members" element={<Members />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/settings" element={<Settings />} />
    </Route>

  This puts DashboardProvider ABOVE the page components, so both the page
  (e.g. Landing calling useDashboard() for firstName) and DashboardLayout
  (rendered inside the page) sit inside the same provider subtree.
*/
export function DashboardShell() {
  return (
    <DashboardProvider>
      <Outlet />
    </DashboardProvider>
  );
}
