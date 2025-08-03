// public/dashboard.js
// Handles Add, Edit, Delete note actions for dashboard.html

document.addEventListener("DOMContentLoaded", () => {
  const notesContainer = document.getElementById("notesContainer");
  const addNoteBtn = document.getElementById("addNoteBtn");

  // Example notes array (replace with API fetch in production)
  let notes = [
    { id: 1, title: "Sample Note Title", content: "This is an example note. You can edit or delete it." }
  ];

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
              <button class="btn btn-sm btn-outline-dark edit-btn" data-id="${note.id}">Edit</button>
              <button class="btn btn-sm btn-danger delete-btn" data-id="${note.id}">Delete</button>
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
  const noteTitleInput = document.getElementById('noteTitle');
  const noteContentInput = document.getElementById('noteContent');

  addNoteBtn.addEventListener("click", () => {
    noteTitleInput.value = "";
    noteContentInput.value = "";
    addNoteModal.show();
  });

  addNoteForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = noteTitleInput.value.trim();
    const content = noteContentInput.value.trim();
    if (!title || !content) return;
    const newNote = {
      id: Date.now(),
      title,
      content
    };
    notes.push(newNote);
    renderNotes();
    addNoteModal.hide();
  });

  // Edit/Delete Note (event delegation)
  notesContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("edit-btn")) {
      const id = Number(e.target.getAttribute("data-id"));
      const note = notes.find(n => n.id === id);
      if (note) {
        const newTitle = prompt("Edit note title:", note.title);
        if (newTitle !== null) note.title = newTitle;
        const newContent = prompt("Edit note content:", note.content);
        if (newContent !== null) note.content = newContent;
        renderNotes();
      }
    }
    if (e.target.classList.contains("delete-btn")) {
      const id = Number(e.target.getAttribute("data-id"));
      if (confirm("Are you sure you want to delete this note?")) {
        notes = notes.filter(n => n.id !== id);
        renderNotes();
      }
    }
  });

  renderNotes();
});
