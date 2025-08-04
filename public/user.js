// public/user.js
// Fetches the current logged-in user's info and sets the username in the dashboard greeting

document.addEventListener("DOMContentLoaded", async () => {
  const usernameSpan = document.getElementById("username");
  try {
    const res = await fetch("/protected/profile");
    if (res.ok) {
      const data = await res.json();
      if (data.username && usernameSpan) {
        usernameSpan.textContent = data.username;
      }
    }
  } catch (err) {
    // Optionally handle error
  }
});
