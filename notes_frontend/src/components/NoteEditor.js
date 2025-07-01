import React, { useState, useEffect } from "react";

/**
 * Editor component for a single note for viewing/editing.
 * @param {Object} props
 * @param {Object} props.note - The note to edit.
 * @param {function} props.onSave - Callback to save changes.
 * @param {boolean} props.loading - Whether the app is busy loading.
 */
function NoteEditor({ note, onSave, loading }) {
  // Local state; edits are staged until save
  const [title, setTitle] = useState(note ? note.title : "");
  const [content, setContent] = useState(note ? note.content : "");
  const [dirty, setDirty] = useState(false);

  // Sync local state when switching notes
  useEffect(() => {
    setTitle(note ? note.title : "");
    setContent(note ? note.content : "");
    setDirty(false);
  }, [note]);

  if (!note) {
    return (
      <section className="note-editor-container">
        <div className="note-editor note-editor-empty">
          No note selected.
        </div>
      </section>
    );
  }

  // PUBLIC_INTERFACE
  const handleSave = (e) => {
    e.preventDefault();
    if (!dirty) return;
    onSave(note.id, { title, content });
    setDirty(false);
  };

  return (
    <section className="note-editor-container">
      <form
        className="note-editor"
        onSubmit={handleSave}
        autoComplete="off"
        aria-label="Edit note"
      >
        <input
          className="note-editor-title-input"
          type="text"
          placeholder="Title"
          value={title}
          maxLength={100}
          onChange={(e) => {
            setTitle(e.target.value);
            setDirty(true);
          }}
        />
        <textarea
          className="note-editor-content"
          rows={10}
          placeholder="Write your note here..."
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            setDirty(true);
          }}
        />
        <div className="note-editor-toolbar">
          <button
            type="submit"
            className="note-editor-save"
            disabled={loading || !dirty}
            aria-label="Save changes"
          >
            Save
          </button>
        </div>
      </form>
    </section>
  );
}

export default NoteEditor;
