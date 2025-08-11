// Handle form submit
document.getElementById("voucherForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const voucherId = document.getElementById("voucherId").value;
  const loading = document.getElementById("loading");
  const result = document.getElementById("voucher-result");

  loading.style.display = "block";
  result.innerHTML = "";

  try {
    const response = await fetch("http://192.168.100.50:3000/api/cek-voucher", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ voucherId })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Terjadi kesalahan.");

    result.innerHTML = `
      <p><strong>Username:</strong> ${data.username}</p>
      <p><strong>Password:</strong> ${data.password}</p>
      <p><strong>Tipe:</strong> ${data.tipe}</p>
      <p><strong>Expired:</strong> ${data.expired}</p>
      <p><strong>Status:</strong> 
        <span class="${data.status === 'Aktif' ? 'aktif' : 'kadaluarsa'}">${data.status}</span>
      </p>
    `;
  } catch (error) {
    result.innerHTML = `<p class="error">${error.message}</p>`;
  } finally {
    loading.style.display = "none";
  }
});

// Toggle dark mode
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("darkModeToggle");
  const icon = toggle.querySelector("i");

  toggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
      icon.classList.replace("fa-moon", "fa-sun");
    } else {
      icon.classList.replace("fa-sun", "fa-moon");
    }
  });
});
