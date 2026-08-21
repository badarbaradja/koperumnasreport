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
| 07 | Tipe `FormSchema` + `FormRenderer` | ✅ | `npx tsc --noEmit` bersih, `npm run build` bersih. Rendering diverifikasi via SSR (`renderToStaticMarkup`) memakai schema uji 3 field (teks, angka, status_warna) — HTML keluaran berisi label & elemen input untuk ketiganya, dan menambah field baru di schema langsung muncul karena renderer sepenuhnya digerakkan dari `schema.blocks`, tanpa cabang kode per form. | **Belum diverifikasi**: perilaku submit → `console.log` interaktif di browser sungguhan — tidak ada tool browser/DOM headless (jsdom/testing-library) tersedia di sesi ini dan saya tidak mau memasang devDependency baru tanpa izin (BLUEPRINT §2). Wiring `handleSubmit(onSubmit)` dari react-hook-form adalah pola standar library, tapi ini klaim dari code review, bukan hasil menjalankan. Field `tabel` & `lampiran` di renderer ini masih representasi native minimal (input polos) — versi penuh (kartu bertumpuk di HP, kompresi gambar, dst) menyusul di Task 08/11 sesuai urutan task board. `FormProvider` dipakai supaya `tabel` (useFieldArray) berbagi context dengan form induk. |
| 08 | Komponen field | ✅ | `npx tsc --noEmit` & `npm run build` bersih. Diverifikasi via SSR (`renderToStaticMarkup`) dengan schema berisi ke-10 tipe field + `nilaiAwal` terisi untuk semuanya: field **terkontrol** (Uang, YaTidak, StatusWarna, Lampiran) terbukti membaca-ulang nilai dengan benar di HTML keluaran (mis. `value="Rp 1.500.000"`, tombol "Ya"/"🟡 Dikawal" terpilih ter-highlight, item lampiran `foto1.jpg` muncul); field **tabel** terbukti jumlah barisnya sesuai `nilaiAwal` (1 baris). Field `angka` punya `min="0"` (default, dinaikkan kalau `field.min` diset). | **Belum diverifikasi langsung**: nilai *default* untuk field **tak-terkontrol** berbasis `register()` (angka, teks, teks_panjang, pilih, centang, isi sel tabel) — react-hook-form mengisi nilai-nilai ini lewat `useEffect` setelah mount di DOM asli, yang tidak berjalan di bawah `renderToStaticMarkup`. Ini perilaku standar react-hook-form yang terdokumentasi, tapi saya belum melihatnya jalan sungguhan di browser karena tidak ada tool DOM/browser di sesi ini. Begitu juga "tabel tidak scroll horizontal di 360px" — diverifikasi lewat tinjauan kode (layout `flex-col`, tanpa lebar tetap yang melebihi kontainer), bukan tangkapan layar viewport sungguhan. |
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
