# PROGRESS

> Diperbarui setiap task selesai. Status: ⬜ belum · 🟨 berjalan · ✅ selesai

| # | Task | Status | Diverifikasi | Catatan |
|---|---|---|---|---|
| 01 | Fondasi proyek & token desain | ✅ | `npm run dev` jalan, `npx tsc --noEmit` bersih, `npm run build` bersih | Package name diubah dari `tmp-vite` ke `koperumnas-laporan`. Struktur folder §5 dibuat (folder kosong belum ke-track git sampai diisi task berikutnya). Boilerplate Vite (App.css, logo, hero.png, icons.svg) dihapus. |
| 02 | Klien Supabase & sesi login | ⬜ | | |
| 03 | Migrasi database — tabel inti | ⬜ | | |
| 04 | Row Level Security | ⬜ | | |
| 05 | Seed `policy`, lokasi, outlet | ⬜ | | |
| 06 | Kerangka layout, routing, penjaga peran | ⬜ | | |
| 07 | Tipe `FormSchema` + `FormRenderer` | ⬜ | | |
| 08 | Komponen field | ⬜ | | |
| 09 | Aturan bukti wajib | ⬜ | | |
| 10 | Simpan draft & kirim laporan | ⬜ | | |
| 11 | Unggah lampiran ke Storage | ⬜ | | |
| 12 | Form `personal_marketing` + sinkron `pte_daily` | ⬜ | | |
| 13 | Form `pic_lokasi` | ⬜ | | |
| 14 | Form `it`, `hrd`, `security`, `perizinan` | ⬜ | | |
| 15 | Form `pembangunan`, `dti`, `kendaraan`, `cs`, `ga` | ⬜ | | |
| 16 | Form `manager_resto`, `ita` | ⬜ | | |
| 17 | Form `accounting` (rahasia) | ⬜ | | |
| 18 | Papan Kontrol | ⬜ | | |
| 19 | Antrean Keputusan CEO | ⬜ | | |
| 20 | View agregasi + dashboard angka CEO | ⬜ | | |
| 21 | Laporan Terpusat Sabrina (auto-isi) | ⬜ | | |
| 22 | Dashboard Kontrol Marketing | ⬜ | | |
| 23 | Halaman admin | ⬜ | | |
| 24 | Uji RLS & deploy | ⬜ | | |

---

## Catatan lintas-task

- `docs/REFERENSI-FORMAT-LAPORAN.md` yang dirujuk `CLAUDE.md` dan `BLUEPRINT.md` **tidak ada** di folder `docs/`. Yang ada hanya `docs/02-FORMAT-LAPORAN-DIVISI-BARU.md`, isinya cuma 9 dari 15 format (HRD, Security, Perizinan, Pembangunan, DTI, Kendaraan, PIC Lokasi, CS, GA). Format "sudah berjalan" (Personal Marketing, Pusat, Accounting, IT, Manager Resto, Ita) belum ada sumbernya di manapun. Ini akan memblokir Task 12, 14 (sebagian: `it`), 16, 17 sampai dokumen ini disediakan.
- `docs/MODE-OTONOM.md` yang dirujuk instruksi awal tidak ada. Urutan batch diambil dari pengelompokan yang diberikan user langsung di percakapan.
- `CLAUDE.md` awalnya ditemukan di `docs/CLAUDE.md`, dipindahkan ke root proyek atas konfirmasi user.
