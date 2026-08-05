import { Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LoginPage } from "./pages/auth/login";
import { RegisterPage } from "./pages/auth/register";
import { DashboardShell } from "./layouts/DashboardShell";
import { Landing } from "./pages/Landing";
import "./pages/tokens.css";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Workspaces } from "./pages/WorkSpaces";
import { Projects } from "./pages/Projects";
import { Tasks } from "./pages/Task";
import { Members } from "./pages/Members";
import { Calendar } from "./pages/Calendar";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<DashboardShell />}>
            <Route path="/" element={<Landing />} />
            <Route path="/workspaces" element={<Workspaces />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/members" element={<Members />} />
            <Route path="/calendar" element={<Calendar />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;