import React from "react";

/**
 * Sidebar component displaying notes, search, and actions.
 * @param {Object} props
 * @param {Array} props.notes - List of notes.
 * @param {number} props.selectedId - Currently selected note id.
 * @param {function} props.onSelect - Callback selecting a note.
 * @param {function} props.onCreate - Callback creating a note.
 * @param {function} props.onDelete - Callback deleting a note.
 * @param {string} props.search - Current search query.
 * @param {function} props.setSearch - Setter for search query.
 */
function Sidebar({
  notes,
  selectedId,
  onSelect,
  onCreate,
  onDelete,
  search,
  setSearch
}) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        Notes
      </div>
      <div className="sidebar-actions">
        <button
          onClick={onCreate}
          className="auth-btn"
          style={{
            minWidth: 0,
            padding: "6px 16px",
            fontSize: ".98rem",
            borderRadius: "7px",
          }}
          aria-label="Create note"
        >
          ＋ New note
        </button>
      </div>
      <div className="sidebar-search">
        <input
          type="text"
          placeholder="Search notes..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          aria-label="Search notes"
        />
      </div>
      <div className="notes-list" style={{ flex: "1 1 auto" }}>
        {notes.length === 0 && (
          <div style={{ padding: "1.2em 0", color: "var(--secondary)", textAlign: "center" }}>
            No notes yet.
          </div>
        )}
        {notes.map((note) => (
          <div
            className={
              "notes-list-item" +
              (note.id === selectedId ? " selected" : "")
            }
            key={note.id}
            onClick={() => onSelect(note.id)}
            tabIndex={0}
            role="button"
            aria-current={note.id === selectedId}
            onKeyDown={e => {
              if (e.key === "Enter" || e.key === " ") onSelect(note.id);
            }}
          >
            <span className="note-title" title={note.title || "Untitled"}>
              {note.title || <i>Untitled</i>}
            </span>
            <button
              className="note-delete"
              title="Delete note"
              onClick={ev => {
                ev.stopPropagation();
                onDelete(note.id);
              }}
              tabIndex={-1}
              aria-label={`Delete note ${note.title}`}
            >
              🗑
            </button>
          </div>
        ))}
      </div>
      <div className="sidebar-footer" tabIndex={-1}>
        <span style={{ color: "var(--primary)", fontWeight: 600 }}>
          NoteMaster
        </span>
        <span style={{ fontSize: ".92em", color: "var(--secondary)", marginLeft: "6px" }}>
          by KAVIA
        </span>
      </div>
    </aside>
  );
}

export default Sidebar;
