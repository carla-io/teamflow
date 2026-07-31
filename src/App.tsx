import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/auth/login";
import { RegisterPage } from "./pages/auth/register";
import { DashboardShell } from "./layouts/DashboardShell";
import { Landing } from "./pages/Landing";
import "./pages/tokens.css";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Workspaces } from "./pages/WorkSpaces";
import { Projects } from "./pages/Projects";
// import { Tasks } from "./pages/Tasks";

function App() {
  return (
    <ThemeProvider>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Everything in here shares one DashboardProvider (auth + profile),
          which both the page components and DashboardLayout read from. */}
      <Route element={<DashboardShell />}>
        <Route path="/" element={<Landing />} />
<Route path="/workspaces" element={<Workspaces />} />
<Route path="/projects" element={<Projects />} />
      </Route>

      

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>

    </ThemeProvider>
  );
}

export default App;