# Catatan Pembaruan (Update Notes)

Berikut adalah catatan pembaruan yang dapat Anda gunakan untuk pesan commit saat melakukan sinkronisasi ke GitHub:

## Ringkasan Fitur
- **Refaktor Kompas (Arah Kiblat):** Memperbaiki tampilan kompas kiblat menjadi lebih presisi dan interaktif, lengkap dengan simulasi manual jika sensor tidak tersedia.
- **Pembersihan Fitur Ganda:** Menghapus tab/fitur "Tasbih" yang berulang pada halaman "Doa Pilihan" agar aplikasi lebih ringkas (karena Tasbih sudah memiliki halaman khususnya tersendiri).
- **Dukungan PWA (Progressive Web App):** Menambahkan konfigurasi meta tag pada `index.html` dan menginstal dukungan `vite-plugin-pwa` agar aplikasi dapat diinstal layaknya aplikasi native melalui browser.
- **Inisialisasi Capacitor untuk Android & iOS:** Menambahkan kerangka `@capacitor/core`, `@capacitor/android`, dan `@capacitor/ios` sehingga basis kode web ini siap untuk dibungkus (build) menjadi aplikasi native platform Android (APK/AAB) dan iOS.

## Pesan Commit Singkat (Copy-Paste)
```text
feat: optimasi arah kiblat, hapus tasbih ganda, dukung PWA & platform native (Android & iOS) via Capacitor
```
