import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import NoteEditor from "./components/NoteEditor";
import AuthPage from "./components/AuthPage";
import "./App.css";
import "./theme.css";

/**
 * Root component of the Notes App.
 * Handles authentication and core note logic; displays either
 * authentication view or the main app layout.
 */
function App() {
  // --- Auth state ---
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  // --- Note state ---
  const [notes, setNotes] = useState([]); // All notes
  const [filteredNotes, setFilteredNotes] = useState([]); // After search
  const [selectedNoteId, setSelectedNoteId] = useState(null);

  // --- UI State ---
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  // --- Effect: Apply theme to HTML root ---
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // --- Effect: Load user/token from localStorage at startup ---
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token && user) {
      setToken(token);
      setUser(JSON.parse(user));
    }
  }, []);

  // --- Effect: Load notes after login or refresh ---
  useEffect(() => {
    if (token) {
      fetchNotes();
    }
  // eslint-disable-next-line
  }, [token]);
  // --- Effect: Filter notes when user types in search ---
  useEffect(() => {
    if (search.trim() === "") setFilteredNotes(notes);
    else {
      setFilteredNotes(
        notes.filter(
          (note) =>
            note.title?.toLowerCase().includes(search.toLowerCase()) ||
            note.content?.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, notes]);

  // --- API URL ---
  const BASE = "https://vscode-internal-293-beta.beta01.cloud.kavia.ai:3001";

  // --- Helper: backend call with error and token automatically handled ---
  async function api(
    endpoint,
    { method = "GET", data, params, authenticated = true } = {}
  ) {
    let url = BASE + endpoint;
    if (params) {
      const q = new URLSearchParams(params).toString();
      url += "?" + q;
    }
    const opts = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };
    if (token && authenticated) opts.headers["Authorization"] = `Bearer ${token}`;
    if (data) opts.body = JSON.stringify(data);

    try {
      setLoading(true);
      setError("");
      const res = await fetch(url, opts);
      if (!res.ok) {
        let errorMsg = "Server error";
        if (res.headers.get("content-type")?.includes("application/json")) {
          const errData = await res.json();
          errorMsg = errData.detail || errData.message || errorMsg;
        } else {
          errorMsg = await res.text();
        }
        throw new Error(errorMsg || res.statusText);
      }
      if (res.status === 204) return null;
      return await res.json();
    } catch (e) {
      setError(e.message || "Failed to connect");
      throw e;
    } finally {
      setLoading(false);
    }
  }

  // --- AUTH ---
  // PUBLIC_INTERFACE
  const handleLogin = async (username, password) => {
    try {
      const resp = await api("/auth/login", {
        method: "POST",
        data: { username, password },
        authenticated: false
      });
      setToken(resp.access_token);
      setUser({ username });
      localStorage.setItem("token", resp.access_token);
      localStorage.setItem("user", JSON.stringify({ username }));
      setError("");
    } catch (e) {
      setError(e.message || "Login failed");
    }
  };

  // PUBLIC_INTERFACE
  const handleSignup = async (username, password) => {
    try {
      const resp = await api("/auth/signup", {
        method: "POST",
        data: { username, password },
        authenticated: false
      });
      // Immediate login after signup
      await handleLogin(username, password);
    } catch (e) {
      setError(e.message || "Signup failed");
    }
  };

  // PUBLIC_INTERFACE
  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setNotes([]);
    setSelectedNoteId(null);
    setError("");
  };

  // NOTES CRUD
  // PUBLIC_INTERFACE
  async function fetchNotes() {
    try {
      const list = await api("/notes", { method: "GET" });
      setNotes(list);
      // If a note was being viewed, try to keep it selected.
      if (selectedNoteId && list.find((n) => n.id === selectedNoteId)) {
        setSelectedNoteId(selectedNoteId);
      } else if (list.length > 0) {
        setSelectedNoteId(list[0].id);
      } else {
        setSelectedNoteId(null);
      }
    } catch {
      // handled by error handler
    }
  }

  // PUBLIC_INTERFACE
  async function createNote() {
    try {
      const note = await api("/notes", {
        method: "POST",
        data: { title: "Untitled", content: "" },
      });
      setNotes([note, ...notes]);
      setSelectedNoteId(note.id);
      setError("");
    } catch {}
  }

  // PUBLIC_INTERFACE
  async function deleteNote(id) {
    if (!window.confirm("Delete this note?")) return;
    try {
      await api(`/notes/${id}`, {
        method: "DELETE",
      });
      setNotes(notes.filter((n) => n.id !== id));
      setSelectedNoteId((s) =>
        s === id && notes.length > 1 ? notes.find(n => n.id !== id)?.id : null
      );
      setError("");
    } catch {}
  }

  // PUBLIC_INTERFACE
  async function updateNote(id, data) {
    try {
      const updated = await api(`/notes/${id}`, {
        method: "PUT",
        data,
      });
      setNotes(notes.map((n) => (n.id === id ? updated : n)));
      setError("");
    } catch {}
  }

  // --- RENDER ---
  if (!token) {
    return (
      <div className="app-bg">
        <AuthPage onLogin={handleLogin} onSignup={handleSignup} error={error} loading={loading} theme={theme} setTheme={setTheme}/>
      </div>
    );
  }

  return (
    <div className="notes-root" data-theme={theme}>
      <Sidebar
        notes={filteredNotes}
        selectedId={selectedNoteId}
        onSelect={setSelectedNoteId}
        onCreate={createNote}
        onDelete={deleteNote}
        search={search}
        setSearch={setSearch}
        theme={theme}
      />
      <main className="main-area">
        <Topbar user={user} onLogout={handleLogout} theme={theme} setTheme={setTheme} />
        {error && <div className="error-message">{error}</div>}
        <NoteEditor
          note={notes.find((n) => n.id === selectedNoteId)}
          onSave={updateNote}
          loading={loading}
        />
      </main>
    </div>
  );
}

export default App;
