# Catatan Pembaruan (Update Notes)

Berikut adalah catatan pembaruan yang dapat Anda gunakan untuk pesan commit:

## Ringkasan Fitur
- **Perbaikan Splash Screen:** Memperbarui CSS container Splash Screen menjadi `absolute inset-0 z-50` agar layout menyesuaikan penuh layar browser secara akurat (`100dvh`) meskipun halaman direfresh (pull-to-refresh) di perangkat seluler.
- **Penyempurnaan Navigasi Bottom:** Merapikan `max-w` pada tab navigasi bawah dan header agar serasi dengan lebar konten layar tablet dan desktop.
- **Notifikasi Adzan Nyata:** Mengganti nada notifikasi sintesis dengan pemutaran audio adzan yang sebenarnya (Subuh.mp3 untuk subuh, dan Azan.mp3 untuk waktu lainnya).

## Pesan Commit Singkat (Copy-Paste)
```text
fix: layout splash screen, navbar tablet & integrasi audio adzan asli
```

