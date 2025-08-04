// public/dashboard.js
// Handles Add, Edit, Delete note actions for dashboard.html

document.addEventListener("DOMContentLoaded", () => {
  // Logout Button
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      window.location.href = "/auth/logout";
    });
  }
  // Edit Note Modal
  const editNoteModal = new bootstrap.Modal(document.getElementById('editNoteModal'));
  const editNoteForm = document.getElementById('editNoteForm');
  const editNoteTitleInput = document.getElementById('editNoteTitle');
  const editNoteContentInput = document.getElementById('editNoteContent');
  let editingNoteId = null;
  const notesContainer = document.getElementById("notesContainer");
  const addNoteBtn = document.getElementById("addNoteBtn");

  // Notes array will be populated from backend
  let notes = [];

  // Fetch notes from backend API
  async function fetchNotes() {
    try {
      const res = await fetch("/api/notes", { credentials: "same-origin" });
      if (!res.ok) throw new Error("Failed to fetch notes");
      notes = await res.json();
      renderNotes();
    } catch (err) {
      notesContainer.innerHTML = `<div class='text-danger'>Error loading notes: ${err.message}</div>`;
    }
  }

  function renderNotes() {
    notesContainer.innerHTML = "";
    notes.forEach(note => {
      const noteCol = document.createElement("div");
      noteCol.className = "col-md-4 mb-3";
      noteCol.innerHTML = `
        <div class="card bg-light text-dark shadow-sm">
          <div class="card-body">
            <h6 class="card-title">${note.title}</h6>
            <p class="card-text text-dark opacity-75">${note.content}</p>
            <div class="d-flex justify-content-end gap-2">
              <button class="btn btn-sm btn-outline-dark edit-btn" data-id="${note._id}">Edit</button>
              <button class="btn btn-sm btn-danger delete-btn" data-id="${note._id}">Delete</button>
            </div>
          </div>
        </div>
      `;
      notesContainer.appendChild(noteCol);
    });
  }

  // Add Note with Bootstrap Modal
  const addNoteModal = new bootstrap.Modal(document.getElementById('addNoteModal'));
  const addNoteForm = document.getElementById('addNoteForm');
  const studentNameInput = document.getElementById('studentName');
  const noteTitleInput = document.getElementById('noteTitle');
  const noteContentInput = document.getElementById('noteContent');

  addNoteBtn.addEventListener("click", () => {
    noteTitleInput.value = "";
    noteContentInput.value = "";
    addNoteModal.show();
  });

  addNoteForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const studentName = studentNameInput.value.trim();
    const title = noteTitleInput.value.trim();
    const content = noteContentInput.value.trim();
    if (!studentName || !title || !content) return;
    // Send new note to backend
    fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentName, title, content }),
      credentials: "same-origin"
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to add note");
        return res.json();
      })
      .then(data => {
        notes.push(data.note);
        renderNotes();
        addNoteModal.hide();
      })
      .catch(err => alert("Error adding note: " + err.message));
  });

  // Edit/Delete Note (event delegation)
  notesContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("edit-btn")) {
      const id = e.target.getAttribute("data-id");
      const note = notes.find(n => n._id === id);
      if (note) {
        editingNoteId = id;
        editNoteTitleInput.value = note.title;
        editNoteContentInput.value = note.content;
        editNoteModal.show();
      }
    }
    if (e.target.classList.contains("delete-btn")) {
      const id = e.target.getAttribute("data-id");
      if (confirm("Are you sure you want to delete this note?")) {
        fetch(`/api/notes/${id}`, { method: "DELETE", credentials: "same-origin" })
          .then(res => {
            if (!res.ok) throw new Error("Failed to delete note");
            // Remove from local notes array
            notes = notes.filter(n => n._id !== id);
            renderNotes();
          })
          .catch(err => alert("Error deleting note: " + err.message));
      }
    }
  });

  // Handle Edit Note form submit
  editNoteForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const newTitle = editNoteTitleInput.value.trim();
    const newContent = editNoteContentInput.value.trim();
    if (!newTitle || !newContent) return;
    fetch(`/api/notes/${editingNoteId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle, content: newContent }),
      credentials: "same-origin"
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to update note");
        return res.json();
      })
      .then(updatedNote => {
        // Update local notes array
        notes = notes.map(n => n._id === editingNoteId ? updatedNote.note : n);
        renderNotes();
        editNoteModal.hide();
      })
      .catch(err => alert("Error updating note: " + err.message));
  });

  fetchNotes();
});
