import type { ReactNode } from "react";
import "./AuthLayout.css";

interface AuthLayoutProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

/**
 * Shared shell for /register and /login.
 * Left panel carries the brand + signature "flow" graphic (nodes pulled
 * into alignment by a connecting current — the TeamFlow idea rendered
 * literally). Right panel is a plain, quiet card so the form stays easy
 * to scan and use.
 */
export function AuthLayout({ eyebrow, title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="auth-page">
      <aside className="auth-panel">
        <div className="auth-panel__brand">
          <span className="auth-panel__mark" aria-hidden="true" />
          TeamFlow
        </div>

        <FlowSignature />

        <div className="auth-panel__copy">
          <p className="auth-panel__heading">Work moves together.</p>
          <p className="auth-panel__subheading">
            One place for your team&apos;s tasks, threads, and updates to stay in sync.
          </p>
        </div>
      </aside>

      <main className="auth-form-side">
        <div className="auth-card">
          <p className="auth-eyebrow">{eyebrow}</p>
          <h1 className="auth-title">{title}</h1>
          <p className="auth-subtitle">{subtitle}</p>

          {children}

          <p className="auth-footer-link">{footer}</p>
        </div>
      </main>
    </div>
  );
}

function FlowSignature() {
  return (
    <svg
      className="auth-flow-svg"
      viewBox="0 0 320 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="flowStroke" x1="0" y1="0" x2="320" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#5EEAD4" />
          <stop offset="100%" stopColor="#60A5FA" />
        </linearGradient>
      </defs>

      <path
        className="auth-flow-path"
        d="M20 150 C 90 150, 90 60, 160 60 S 250 150, 300 90"
        stroke="url(#flowStroke)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="6 10"
      />

      <circle cx="20" cy="150" r="6" fill="#5EEAD4" />
      <circle cx="160" cy="60" r="6" fill="#93C5FD" />
      <circle cx="300" cy="90" r="6" fill="#60A5FA" />
      <circle cx="90" cy="105" r="3" fill="#5EEAD4" opacity="0.6" />
      <circle cx="230" cy="105" r="3" fill="#60A5FA" opacity="0.6" />
    </svg>
  );
}