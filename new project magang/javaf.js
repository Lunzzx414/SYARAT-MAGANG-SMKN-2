// LOGIN
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const loginMessage = document.getElementById("loginMessage");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem("token", data.token);
        window.location.href = "dashboard.html";
      } else {
        loginMessage.textContent = "Username/Password salah!";
      }
    });
  }

  // DASHBOARD
  const eventForm = document.getElementById("eventForm");
  const eventList = document.getElementById("eventList");
  const anggotaList = document.getElementById("anggotaList");
  const searchName = document.getElementById("searchName");

  if (eventForm) {
    // Tambah event
    eventForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("eventName").value;
      const date = document.getElementById("eventDate").value;

      await fetch("http://localhost:3000/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, date })
      });

      loadEvents();
    });

    // Cari anggota
    searchName.addEventListener("input", async () => {
      const res = await fetch(`http://localhost:3000/anggota?name=${searchName.value}`);
      const anggota = await res.json();
      anggotaList.innerHTML = anggota.map(a => `<li>${a.nama}</li>`).join("");
    });

    // Load awal
    loadEvents();
  }

  async function loadEvents() {
    const res = await fetch("http://localhost:3000/events");
    const events = await res.json();
    eventList.innerHTML = events.map(ev => `
      <li>${ev.name} - ${ev.date} <button onclick="deleteEvent('${ev.id}')">Hapus</button></li>
    `).join("");
  }
});

async function deleteEvent(id) {
  await fetch(`http://localhost:3000/events/${id}`, { method: "DELETE" });
  location.reload();
}
document.getElementById("searchEvent").addEventListener("keyup", function () {
    let filter = this.value.toLowerCase();
    let rows = document.querySelectorAll("#eventTable tbody tr");
    rows.forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(filter) ? "" : "none";
    });
});

document.getElementById("searchMember").addEventListener("keyup", function () {
    let filter = this.value.toLowerCase();
    let rows = document.querySelectorAll("#memberTable tbody tr");
    rows.forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(filter) ? "" : "none";
    });
});
