
# 📲 WhatsApp Web API using whatsapp-web.js

Project ini menyediakan API berbasis Express untuk mengirim pesan WhatsApp (ke user atau grup) menggunakan `whatsapp-web.js`.

## 📦 Instalasi

1. **Clone repositori dan masuk ke folder proyek:**

```bash
git clone <repo-url>
cd NEW-WA-WEB
```

2. **Install dependency:**

```bash
npm install
```

## 🚀 Menjalankan Aplikasi

```bash
node main.js
```

Saat pertama kali dijalankan, akan muncul **QR Code** di terminal. Scan QR code tersebut menggunakan WhatsApp Web (di HP kamu).

Setelah berhasil scan dan login, akan muncul:

```
Client is ready!
```

Server Express akan berjalan di: [http://localhost:3000](http://localhost:3000)

---

## 📡 API Endpoint

### 1. Kirim Pesan ke Nomor WhatsApp

**GET** `/send?to=628xxxx&message=Halo`

| Parameter | Keterangan |
|----------|------------|
| `to`     | Nomor WhatsApp (format internasional tanpa +, misal: 628123xxxxxxx) |
| `message`| Pesan teks yang ingin dikirim |

**Contoh:**

```
GET http://localhost:3000/send?to=6281234567890&message=Halo%20dari%20API
```

---

### 2. Daftar Grup

**GET** `/list-groups`

Mengembalikan daftar grup WhatsApp yang user bergabung.

**Contoh Response:**

```json
[
  {
    "id": "1234567890-123456@g.us",
    "name": "Grup Keluarga"
  },
  {
    "id": "9876543210-098765@g.us",
    "name": "Project Team"
  }
]
```

---

### 3. Kirim Pesan ke Grup

**GET** `/send-group?groupName=NamaGrup&message=Halo`

| Parameter     | Keterangan |
|---------------|------------|
| `groupName`   | Nama grup WhatsApp (case-insensitive) |
| `message`     | Pesan teks yang ingin dikirim |

**Contoh:**

```
GET http://localhost:3000/send-group?groupName=Grup%20Keluarga&message=Selamat%20pagi!
```

---

## 📝 Catatan

- Folder `.wwebjs_auth/` dan `.wwebjs_cache/` menyimpan sesi login WhatsApp, jadi kamu tidak perlu scan QR setiap kali menjalankan.
- Jangan commit folder auth/cache ke Git — sudah diatur di `.gitignore`.
- Aplikasi ini hanya bisa mengirim pesan jika WhatsApp Web tetap login.

---

## 📄 Lisensi

MIT
