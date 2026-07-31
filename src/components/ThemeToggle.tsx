// components/ThemeToggle.tsx
import { useTheme } from "../contexts/ThemeContext";
import { IconSun, IconMoon } from "../layouts/icons";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="console-icon-btn"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
    >
      {theme === "dark" ? <IconSun /> : <IconMoon />}
    </button>
  );
}