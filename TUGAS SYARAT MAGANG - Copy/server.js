// Gantilah URL_API_BACKEND dengan URL dari tim backend kamu
const API_URL = "http://192.168.100.50:3000/api/cek-voucher";

async function cekVoucher(voucherId) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ voucherId }),
    });

    const data = await response.json();

    if (response.ok) {
      // Tampilkan data voucher (misal username, password, status, tipe, expired)
      console.log("Voucher:", data);
      document.getElementById("status").innerText = `Status: ${data.status}`;
      document.getElementById("username").innerText = `Username: ${data.username}`;
      document.getElementById("password").innerText = `Password: ${data.password}`;
      document.getElementById("tipe").innerText = `Tipe: ${data.tipe}`;
      document.getElementById("expired").innerText = `Expired: ${data.expired}`;
    } else {
      alert(data.error || "Voucher tidak ditemukan");
    }
  } catch (error) {
    console.error("Gagal terhubung ke server", error);
    alert("Gagal menghubungi server");
  }
}
