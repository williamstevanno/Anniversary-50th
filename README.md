# 50th Wedding Anniversary — GitHub Pages Ready (V2)

Website statis untuk perayaan 50th Wedding Anniversary Yiu Hok Cuan & Tok A Kiok.

## Yang sudah dikonfigurasi

- RSVP WhatsApp langsung ke **085267020568** (format sistem: `6285267020568`).
- Musik menggunakan embed YouTube dengan video ID **Dn9mpQYne_Q**.
- Musik mulai setelah tamu menekan **Buka Undangan** karena browser modern memblokir autoplay bersuara sebelum interaksi pengguna.
- Ornamen tambahan: bunga/daun gaya Chinese, motif awan emas, sudut dekoratif, dan kelopak jatuh.
- Nama tamu dinamis melalui query string, contoh: `?to=Kingsman%20%26%20Ashanty`.

## Upload ke GitHub Pages

Upload **semua isi folder ini langsung ke root repository**, sehingga `index.html` terlihat langsung di halaman utama repository.

Struktur yang benar:

```text
index.html
styles.css
script.js
config.js
.nojekyll
assets/
  couple.jpg
  floral-corner.svg
  cloud-divider.svg
```

Kemudian buka **Settings → Pages → Deploy from a branch → main → /(root)**.

## Mengubah data

Semua data utama ada di `config.js`, termasuk nomor WhatsApp, tanggal, lokasi, dan video YouTube.


## Update V3
- Menambahkan informasi jamuan Ciak Tok / makan bersama di meja.
- RSVP menegaskan jumlah tamu wajib diisi dan menyediakan pilihan 0–20 orang.
- Menambahkan daftar 7 jenis hadiah tanpa harga.
- Setiap hadiah memiliki ilustrasi SVG animasi: TV, kulkas, mesin cuci, power bank, dispenser, setrika, dan kipas.
- RSVP WhatsApp tetap menuju 085267020568 (format internasional 6285267020568).
