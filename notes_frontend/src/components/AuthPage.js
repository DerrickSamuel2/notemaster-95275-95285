import React, { useState } from "react";

/**
 * Authentication UI page handling login/signup switch and form.
 * @param {Object} props
 * @param {function} props.onLogin - callback for login
 * @param {function} props.onSignup - callback for signup
 * @param {string} props.error - error message
 * @param {boolean} props.loading
 * @param {string} props.theme
 * @param {function} props.setTheme
 */
function AuthPage({
  onLogin,
  onSignup,
  error,
  loading,
  theme,
  setTheme
}) {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [pwRepeat, setPwRepeat] = useState("");

  // Simple validation
  let canSubmit = !!username && !!password;
  if (isSignup) {
    canSubmit = canSubmit && !!pwRepeat && password === pwRepeat;
  }

  // PUBLIC_INTERFACE
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    if (isSignup) onSignup(username, password);
    else onLogin(username, password);
  };

  return (
    <div className="auth-bg">
      <div className="auth-panel" aria-label={isSignup ? "Signup" : "Login"}>
        <button
          className="theme-toggle-btn"
          style={{
            position: "absolute",
            right: 22,
            top: 22,
          }}
          type="button"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          aria-label={
            theme === "light" ? "Enable dark mode" : "Enable light mode"
          }
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
        <div className="auth-title">{isSignup ? "Sign Up" : "Sign In"}</div>
        <form autoComplete="off" onSubmit={handleSubmit}>
          <label className="auth-label" htmlFor="username">Username</label>
          <input
            className="auth-input"
            id="username"
            type="text"
            autoFocus
            autoComplete="username"
            maxLength={50}
            value={username}
            onChange={e => setUsername(e.target.value)}
            disabled={loading}
          />
          <label className="auth-label" htmlFor="password">Password</label>
          <input
            className="auth-input"
            id="password"
            type="password"
            autoComplete="current-password"
            maxLength={100}
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={loading}
          />
          {isSignup && (
            <>
              <label className="auth-label" htmlFor="pwrepeat">Repeat password</label>
              <input
                className="auth-input"
                id="pwrepeat"
                type="password"
                autoComplete="new-password"
                maxLength={100}
                value={pwRepeat}
                onChange={e => setPwRepeat(e.target.value)}
                disabled={loading}
              />
            </>
          )}
          <button
            className="auth-btn"
            type="submit"
            disabled={loading || !canSubmit}
          >
            {loading
              ? "Please wait..."
              : isSignup ? "Create Account" : "Login"}
          </button>
        </form>
        <button
          className="auth-toggle"
          type="button"
          onClick={() => setIsSignup((v) => !v)}
          disabled={loading}
        >
          {isSignup ? "Already have an account?" : "Create an account"}
        </button>
        {error && (
          <div className="error-message" aria-live="assertive">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthPage;
