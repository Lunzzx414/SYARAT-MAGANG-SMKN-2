document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorEl = document.getElementById("loginError");

  errorEl.textContent = "";

  try {
    // Kirim ke backend Node.js kamu
    const res = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      // Simpan token di localStorage
      localStorage.setItem("authToken", data.token);
      window.location.href = "index.html";
    } else {
      errorEl.textContent = data.message || "Login gagal!";
    }
  } catch (err) {
    errorEl.textContent = "Gagal terhubung ke server!";
  }
});
