import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/auth/login";
import { RegisterPage } from "./pages/auth/register";
import { Landing } from "./pages/Landing";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
      <Route path="/" element={<Landing />} />
    </Routes>
  );
}

export default App;