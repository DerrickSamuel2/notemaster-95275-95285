import React from "react";

/**
 * Top bar displaying NoteMaster branding, user info, theme toggle, and logout.
 * @param {Object} props
 * @param {Object} props.user
 * @param {function} props.onLogout
 * @param {string} props.theme
 * @param {function} props.setTheme
 */
function Topbar({ user, onLogout, theme, setTheme }) {
  return (
    <header className="topbar">
      <span className="app-title">NoteMaster</span>
      <div className="user-block">
        <button
          className="theme-toggle-btn"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          aria-label={
            theme === "light" ? "Enable dark mode" : "Enable light mode"
          }
        >
          {theme === "light" ? "🌙" : "☀️"} {theme === "light" ? "Dark" : "Light"}
        </button>
        <span>{user?.username}</span>
        <button className="logout-btn" onClick={onLogout} aria-label="Logout">
          Logout
        </button>
      </div>
    </header>
  );
}

export default Topbar;
