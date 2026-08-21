# Sistem Laporan Harian Koperumnas Group
### Dokumen Spesifikasi v1.0

> Menggantikan laporan harian berbasis WhatsApp/teks menjadi satu website terpusat,
> di mana setiap divisi mengisi form, dan laporan Ibu Sabrina serta dashboard CEO
> terisi otomatis dari isian divisi.

---

## 1. Masalah yang dipecahkan

Format laporan yang berjalan sekarang sudah sangat rinci dan bagus. Tiga masalah struktural yang muncul kalau tetap dijalankan lewat teks:

| Masalah | Akibat sekarang | Solusi di website |
|---|---|---|
| **Angka diketik ulang** | Data konsumen (STK, STKB, Suspend) diketik IT, lalu diketik ulang Sabrina. Rawan beda angka. | Sabrina tidak mengetik ulang. Field terisi otomatis dari laporan IT. |
| **Tidak tahu siapa belum lapor** | Sabrina harus mengejar satu per satu di WA. | Papan status otomatis: siapa sudah, siapa belum, jam berapa. |
| **Bukti foto/video tercecer** | Video kontrol resto & bukti PTE tenggelam di chat. | Bukti diunggah menempel pada baris laporannya, tersimpan per tanggal. |
| **Keputusan CEO tidak terlacak** | Poin 17 laporan Sabrina diisi manual, tidak ada riwayat. | Setiap divisi menandai "butuh keputusan CEO" → otomatis masuk antrean CEO. |
| **Kepatuhan PTE dihitung manual** | Pak Fauzi & Pak Dea menghitung sendiri siapa bolong. | Dihitung sistem, harian dan bulanan. |

---

## 2. Peta alur pelaporan

```
                                    ┌─────────────────┐
                                    │  CEO            │
                                    │  Tante Bestie   │
                                    └────────┬────────┘
                                             │
                 ┌───────────────────────────┼──────────────────────┐
                 │                           │                      │
        ┌────────┴────────┐        ┌─────────┴────────┐   ┌─────────┴────────┐
        │ ACCOUNTING      │        │ IBU SABRINA      │   │ ITA              │
        │ CONFIDENTIAL    │        │ Pusat Kontrol    │   │ Thrifting & F&B  │
        │ langsung ke CEO │        │ & Pelaporan      │   │ (verifikasi Rp   │
        └────────┬────────┘        └─────────┬────────┘   │  ke Accounting)  │
                 │                           │            └──────────────────┘
                 │ hanya rekap umum          │
                 └──────────────────────────►│
                                             │
     ┌──────────┬──────────┬──────────┬──────┴───┬──────────┬──────────┬──────────┐
     │          │          │          │          │          │          │          │
    IT        HRD      SECURITY   PERIZINAN  PEMBANGUNAN   DTI      DRIVER       CS
                                                  │
                                          ┌───────┴───────┐
                                          │  PIC LOKASI   │  (satu laporan per lokasi)
                                          └───────────────┘

     ┌──────────────────────┐        ┌──────────────────────┐
     │ MANAGER RESTO        │        │ LAPORAN PERSONAL     │
     │ per outlet           │        │ MARKETING            │
     └──────────────────────┘        │ WAJIB SEMUA KARYAWAN │
                                     │ kontrol: Pak Fauzi   │
                                     │          & Pak Dea   │
                                     └──────────────────────┘
```

**Aturan yang tidak boleh dilanggar sistem:**

1. Detail keuangan Accounting **hanya** terlihat oleh CEO. Sabrina menerima empat angka saja: total uang masuk, total uang keluar, net, dan status 🟢/🟡/🔴.
2. Laporan Personal Marketing wajib untuk **seluruh karyawan tanpa kecuali** — termasuk IT, Accounting, Security, dan Manager Resto. Jabatan tidak membebaskan kewajiban ini.
3. Manager Resto **tidak** mengisi ulang PTE personal anak buahnya. Manager hanya melihat rekap lengkap/tidak lengkap.

---

## 3. Peran & hak akses

| Peran | Mengisi | Melihat | Catatan |
|---|---|---|---|
| **CEO** | Keputusan/ACC | Semua, termasuk Accounting detail | Antrean keputusan, riwayat ACC |
| **Pusat Pelaporan (Sabrina)** | Laporan Terpusat | Semua divisi, Accounting **rekap saja** | Bisa menagih PIC yang belum lapor |
| **Accounting** | Laporan Accounting | Data keuangan seluruh unit, setoran resto | Tidak melihat laporan divisi non-keuangan |
| **Kontrol Marketing (Fauzi, Dea)** | Catatan tindak lanjut | Seluruh Laporan Personal Marketing + rekap kepatuhan | Tidak melihat keuangan |
| **Kepala Divisi** | Form divisinya | Laporan divisinya sendiri (riwayat) | IT, HRD, Security, Perizinan, Pembangunan, DTI, Driver, CS |
| **PIC Lokasi** | Form lokasinya | Lokasi yang dipegang saja | Bisa pegang >1 lokasi |
| **Manager Resto** | Form outletnya | Outletnya + status PTE karyawan outletnya | Indosteak / Indokopi |
| **Ita** | Thrifting & kontrol F&B | Thrifting + pembukuan resto + stok | Verifikasi akhir tetap Accounting |
| **Karyawan** | Laporan Personal Marketing | Laporannya sendiri + progres targetnya | Semua orang punya peran ini |

Satu orang bisa memegang beberapa peran. Contoh: PIC IT juga wajib mengisi Laporan Personal Marketing; Manager Resto juga PIC lokasi outletnya.

---

## 4. Daftar modul (form)

| # | Form | Pengisi | Frekuensi | Status |
|---|---|---|---|---|
| 01 | Laporan Personal Marketing | Seluruh karyawan | Harian | ✅ format ada |
| 02 | Laporan Terpusat | Sabrina | Harian | ✅ format ada |
| 03 | Laporan Accounting (CONFIDENTIAL) | Accounting | Harian | ✅ format ada |
| 04 | Laporan IT | PIC IT | Harian | ✅ format ada |
| 05 | Laporan Manager Resto | Manager per outlet | Harian | ✅ format ada |
| 06 | Laporan Ita – Thrifting & F&B | Ita | Harian + Senin (stock opname) | ✅ format ada |
| 07 | Laporan HRD | HRD | Harian | 🆕 dibuat |
| 08 | Laporan Security / Satpam | Koordinator satpam | Harian per shift | 🆕 dibuat |
| 09 | Laporan Perizinan | PIC Perizinan | Harian | 🆕 dibuat |
| 10 | Laporan Pembangunan | Kepala Pembangunan | Harian | 🆕 dibuat |
| 11 | Laporan DTI / Precast / Perikas | PIC DTI | Harian | 🆕 dibuat |
| 12 | Laporan Kendaraan & Driver | Koordinator driver | Harian | 🆕 dibuat |
| 13 | Laporan PIC Lokasi | PIC tiap lokasi | Harian | 🆕 dibuat |
| 14 | Laporan Customer Service | CS | Harian | 🆕 dibuat |
| 15 | Laporan Operasional Kantor (GA) | GA / Umum | Harian | 🆕 dibuat |

Nomor 14 dan 15 tidak ada di daftar awal, tapi bagian 2 dan 3 laporan Sabrina membutuhkan datanya dan sekarang belum ada sumbernya. Kalau memang ditangani orang yang sama dengan HRD, dua form ini bisa digabung — tinggal bilang.

---

## 5. Peta auto-isi — bagian terpenting

Ini yang membuat website lebih berguna daripada format teks. Sabrina **tidak mengetik ulang** angka yang sudah diisi divisi lain.

### Laporan Terpusat Sabrina

| Bagian laporan Sabrina | Sumber | Cara isi |
|---|---|---|
| 1. Data konsumen / sistem | Laporan IT §2 | Otomatis |
| 2. CS & masalah konsumen | Laporan CS | Otomatis |
| 3. Operasional kantor | Laporan GA | Otomatis |
| 4. Security / satpam | Laporan Security | Otomatis |
| 5. HRD / absensi | Laporan HRD | Otomatis |
| 6. Perizinan | Laporan Perizinan | Otomatis |
| 7. Pembangunan seluruh lokasi | Jumlah seluruh Laporan PIC Lokasi + Laporan Pembangunan | Otomatis (SUM) |
| 8. Kontrol per lokasi | Laporan PIC Lokasi (1 kartu per lokasi) | Otomatis, kartu bertambah sendiri |
| 9. STK & rumah tidak ditempati | Laporan PIC Lokasi + IT §2 | Otomatis |
| 10. DTI / precast / perikas | Laporan DTI | Otomatis |
| 11. Keuangan umum | Laporan Accounting §2 & §4 (**rekap saja**) | Otomatis, 4 angka |
| 12. Kendaraan & driver | Laporan Driver | Otomatis |
| 13. Marketing | Jumlah seluruh Laporan Personal Marketing hari itu | Otomatis (COUNT/SUM) |
| 14. IT / digital / medsos | Laporan IT §5, §6, §8, §9 | Otomatis |
| 15. Rekap status PIC | Sistem: siapa submit, siapa belum | Otomatis penuh |
| 16. Target besok | — | **Diisi Sabrina** |
| 17. Keputusan yang dibutuhkan CEO | Semua item bertanda "butuh keputusan CEO" dari divisi mana pun | Otomatis terkumpul, Sabrina menyusun prioritas |
| Kesimpulan Sabrina | — | **Diisi Sabrina** |

Yang ditulis Sabrina tinggal tiga: target besok, penyusunan prioritas keputusan, dan kesimpulan. Sisanya membaca dan mengawal.

### Rekap lain

| Terisi otomatis | Dari |
|---|---|
| Manager Resto §11 (kontrol PTA/PTE karyawan) | Laporan Personal Marketing karyawan outlet tersebut |
| Accounting §13 (rekonsiliasi resto) | Laporan Manager Resto §2 + Laporan Ita §5–6 |
| Ita §5–6 vs Manager Resto §2 | Sistem membandingkan sendiri, memunculkan selisih |
| Laporan IT §7 (PIC lokasi belum kirim foto) | Daftar PIC Lokasi yang belum unggah media |

### Silang-cek otomatis yang harus muncul sebagai peringatan

1. Omzet Indosteak versi Manager Resto ≠ versi Ita → tandai 🔴 di dua laporan sekaligus.
2. Cash resto diterima tapi belum disetor > 1 hari → naik ke Accounting §14.
3. Stok sistem ≠ stok aktual → wajib isi penyebab, tidak bisa submit kosong.
4. PIC Lokasi belum lapor lewat jam batas → otomatis masuk daftar "belum melapor" di laporan Sabrina.

---

## 6. Aturan bisnis yang dikodekan sistem

### Marketing personal (berlaku ke semua karyawan)

| Aturan | Perhitungan sistem |
|---|---|
| Minimal **2 closing/bulan** | Kurang dari 2 di akhir bulan → status 🔴, masuk daftar potongan Rp300.000 |
| Minimal **20 undangan konsumen baru/bulan** | Akumulasi berjalan, ditampilkan `___ / 20` tiap hari |
| **PTE harian** = 6 kewajiban | Live, undangan, kesaksian, Google Review, min. 3 konten VT, video mentahan |
| **PTE Rp500.000** | Hanya jika PTE lengkap **dan** ada bukti, rutin setiap hari tanpa bolong |
| Bukti wajib | Form tidak bisa disubmit dengan centang ✅ tanpa lampiran |

Prinsipnya sudah tertulis di format Anda: *"Tidak cukup hanya menulis 'sudah'. Harus ada bukti."* Sistem menegakkan itu — centang tanpa lampiran ditolak.

### Operasional

- **Stock opname Ita** aktif otomatis setiap Senin, tidak bisa dilewat.
- **Video kontrol Manager Resto** (10 video wajib) harus tanggal hari itu — sistem menolak file dengan tanggal lama.
- **Selisih apa pun** (uang atau stok) wajib disertai penyebab. Prinsip Ita: *tidak boleh ada selisih tanpa penjelasan.*
- **Barang thrifting** tidak bisa ditandai "siap jual" sebelum label, harga, data, dan sistem tercentang.

---

## 7. Skema data (ringkas)

```
users            id, nama, jabatan, divisi_id, outlet_id, roles[], aktif
lokasi           id, nama, pic_user_id, alamat
outlet           id, nama (Indosteak/Indokopi), manager_user_id
divisi           id, nama, form_key

laporan          id, form_key, tanggal, user_id, ref_id (lokasi/outlet),
                 status (draft/terkirim/terlambat), submitted_at,
                 status_warna (hijau/kuning/merah)
laporan_field    laporan_id, field_key, nilai (teks/angka/boolean/uang)
lampiran         laporan_id, field_key, tipe (foto/video/dokumen), url,
                 diambil_pada, ukuran

keputusan_ceo    id, laporan_id, judul, masalah, nominal, pic_user_id,
                 deadline, urgensi, status (menunggu/disetujui/ditunda/ditolak),
                 keputusan_teks, diputuskan_at
pte_harian       user_id, tanggal, live, undangan, kesaksian, google_review,
                 konten (jumlah), video_mentahan, lengkap (bool)
target_bulanan   user_id, bulan, undangan_akum, closing_akum,
                 hari_pte_lengkap, hari_pte_bolong
```

Satu tabel `laporan_field` yang generik memungkinkan form ditambah/diubah tanpa ubah database — penting karena format laporan Anda kemungkinan besar akan terus disempurnakan.

---

## 8. Dashboard

### Dashboard CEO
1. **Papan kontrol** — status seluruh divisi & lokasi hari ini: 🟢 aman / 🟡 dikawal / 🔴 urgent / ⚪ belum lapor.
2. **Antrean keputusan** — semua permintaan ACC dari semua laporan, satu daftar, bisa langsung diputuskan: BAYAR / TUNDA / CICIL / catatan.
3. **Uang** — saldo tersedia, masuk, keluar, net, surplus/kekurangan (dari Accounting).
4. **Pembangunan** — target vs realisasi unit seluruh lokasi.
5. **Marketing** — closing bulan berjalan, karyawan tertinggal target.

### Dashboard Sabrina
Sama, minus detail keuangan, plus tombol **tagih** untuk PIC yang belum lapor.

### Dashboard Kontrol Marketing (Fauzi & Dea)
Tabel seluruh karyawan × hari, kolom 6 kewajiban PTE, sel merah = bolong. Peringkat undangan & closing bulan berjalan.

---

## 9. Hal teknis yang perlu diputuskan

**Mobile dulu.** PIC lokasi, satpam, dan manager resto mengisi dari HP di lapangan. Desain dan ukuran form mengikuti layar HP, bukan desktop.

**Video besar.** 10 video wajib per outlet per hari × 2 outlet × 30 hari itu berat. Perlu kompresi otomatis di sisi HP sebelum diunggah, dan kebijakan penyimpanan (misal video mentah disimpan 90 hari, lalu hanya thumbnail).

**Sinyal lemah.** Form harus bisa diisi offline dan terkirim saat sinyal kembali, kalau tidak PIC lokasi akan tetap lari ke WhatsApp.

**Notifikasi WhatsApp.** Karena kebiasaan tim sudah di WA, pengingat otomatis sebaiknya lewat WA, bukan email.

---

## 10. Tahapan pengerjaan

| Fase | Isi | Perkiraan |
|---|---|---|
| **1** | Login & peran, Laporan Personal Marketing, papan kontrol siapa sudah lapor | 2–3 minggu |
| **2** | Form IT, HRD, Security, PIC Lokasi, Pembangunan, Perizinan, DTI, Driver, CS, GA | 3–4 minggu |
| **3** | Laporan Terpusat Sabrina auto-isi + dashboard CEO + antrean keputusan | 2–3 minggu |
| **4** | Accounting confidential, Manager Resto, Ita, silang-cek otomatis | 3–4 minggu |
| **5** | Notifikasi WA, mode offline, laporan bulanan, ekspor | 2–3 minggu |

Fase 1 saja sudah menyelesaikan masalah terbesar: kepatuhan PTE seluruh karyawan terhitung otomatis.

---

## 11. Yang masih perlu dikonfirmasi

1. **PTE Rp500.000** — apakah dibayar bulanan dan hangus kalau bolong satu hari saja, atau dihitung per hari lengkap?
2. **Potongan Rp300.000** — dipotong dari gaji bulan berikutnya? Berlaku juga untuk karyawan baru yang belum genap sebulan?
3. **Jam batas laporan** — pukul berapa laporan dianggap terlambat? Apakah beda per divisi (satpam per shift, resto setelah tutup)?
4. **Jumlah lokasi & outlet** — berapa lokasi perumahan aktif, dan berapa PIC? Ini menentukan bentuk papan kontrol.
5. **Jumlah karyawan total** — menentukan beban form personal marketing harian.
6. **CS dan GA** — orang terpisah, atau ditangani HRD?
7. **Hari libur** — laporan tetap wajib di hari Minggu/libur?
