# Catatan Pembaruan (Update Notes)

Berikut adalah catatan pembaruan yang dapat Anda gunakan untuk pesan commit:

## Ringkasan Fitur
- **Perbaikan Splash Screen:** Memperbaiki tata letak splash screen yang tidak memuat layar penuh dengan sempurna pada saat halaman browser di-refresh. Perbaikan ini membuat layar splash otomatis merentang (`flex-1`) memenuhi parent `min-height: 100dvh`.
- **Pembaruan Ayat Hari Ini:** Menambahkan pustaka pilihan ayat-ayat harian yang ringkas, memotivasi, dan penuh hikmah.
- **Slide Otomatis (Rotasi Harian):** Fitur "Ayat Hari Ini" kini secara dinamis merotasi 5 ayat pilihan per hari yang berganti setiap 12 detik. Kumpulan ayat ini akan diperbarui otomatis setiap harinya.
- **Transisi Halus:** Menambahkan animasi transisi (fade) yang anggun saat ayat berganti tanpa mengubah desain dasar komponen atau fitur Bagikan/Baca Ayat.

## Pesan Commit Singkat (Copy-Paste)
```text
fix: layout tinggi splash screen saat refresh & ubah render indikator slide
```

