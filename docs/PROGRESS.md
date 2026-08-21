# PROGRESS

> Diperbarui setiap task selesai. Status: ⬜ belum · 🟨 berjalan · ✅ selesai

## Migrasi stack: Vite → Next.js 15/16 (21 Agustus 2026)

Keputusan diambil ulang oleh user, didokumentasikan di `BLUEPRINT.md` §2. Proyek di-scaffold ulang total dengan `create-next-app@latest --ts --app --tailwind --eslint --src-dir=false` (perintah persis dari `docs/MULAI-DI-SINI.md`).

**Versi Next.js: 16.3.2, bukan 15.** `create-next-app@latest` memasang versi terbaru (16), bukan 15 seperti tertulis di BLUEPRINT §2. Saya berhenti dan menanyakan ini secara eksplisit (scaffold Next.js sendiri men-generate `AGENTS.md` berisi peringatan "This is NOT the Next.js you know... breaking changes... may differ from your training data") — user memilih **lanjut dengan Next.js 16**. Konsekuensinya:
- `LayoutProps<'/'>` di `app/layout.tsx` adalah tipe baru yang butuh `npx next typegen` (atau `next dev`/`next build`) dijalankan dulu sebelum `tsc` bersih — bukan tersedia begitu saja.
- ESLint bawaan (`eslint-plugin-react-hooks` versi baru) punya aturan `react-hooks/refs` yang salah-tangkap (false positive) pola `useController` react-hook-form — lihat catatan di baris Task 07/08 di bawah.
- `next lint` sudah dihapus di v16; script `lint` di `package.json` memakai `eslint` langsung (sudah begitu dari scaffold, bukan saya ubah).
- Turbopack aktif default untuk `dev` dan `build` (tidak perlu flag `--turbopack` lagi).
- **BLUEPRINT.md dan CLAUDE.md belum diperbarui menyebut versi 16** — masih tertulis "Next.js 15". Ini utang dokumentasi, bukan kesalahan kode. *(Belum saya perbaiki sendiri karena bukan bagian dari 5 langkah yang diminta — tandai untuk diperbaiki.)*

**Duplikat `CLAUDE.md` ditemukan dan diberesi.** Proses update dokumen user menulis versi baru ke `docs/CLAUDE.md`, sementara versi lama (Vite) masih ada di root — dua sumber kebenaran yang saling bertentangan (root eksplisit bilang "Jangan pasang: Next.js"). Root `CLAUDE.md` ditimpa dengan isi baru (Next.js), `docs/CLAUDE.md` dihapus. Juga memperbaiki satu typo warisan di dalamnya: aturan #6 masih menyebut `src/forms/` padahal struktur baru §5 taruh `forms/` di root (tanpa `src/`, sesuai `--src-dir=false`).

**Task 01, 07, 08, 09 dipindah 1:1** dari `src/{components,forms,lib,styles}` (Vite) ke `{components,forms,lib}/` + `app/tokens.css` (Next.js root, `--src-dir=false`). Karena struktur folder relatif sama (components/, forms/, lib/ tetap sibling), **tidak ada satu pun import path yang berubah** — hanya penambahan `'use client'` di `FormRenderer.tsx` dan seluruh `components/fields/*.tsx` (BLUEPRINT §3.4). `forms/*.ts` dan `lib/rupiah.ts` tidak diberi `'use client'` (bukan komponen, tidak pakai hook).

Yang **tidak bisa** dipindah 1:1 (perbedaan mendasar Vite vs Next.js App Router, bukan pilihan bebas):
- Font Google (dulu `<link>` di `index.html`) → sekarang `next/font/google` di `app/layout.tsx`. Token `--display`/`--body`/`--mono` di `tokens.css` diubah dari nama font literal menjadi `var(--font-display)` dkk. supaya nyambung ke variabel yang di-generate `next/font`. Komponen yang memakai token ini (`FormRenderer`, semua field) **tidak disentuh** — mereka hanya mengonsumsi `var(--display)`, jadi tidak tahu dan tidak perlu tahu perubahan di baliknya.
- `index.html` (lang, title) → `app/layout.tsx` pakai `<html lang="id">` + `export const metadata`.
- `src/App.tsx` (placeholder Task 01) → `app/page.tsx`, isi sama (judul + subjudul pakai token).

**Task 02 (klien Supabase, AuthProvider, halaman Masuk) SENGAJA TIDAK dipindah** — instruksi migrasi eksplisit hanya menyebut 01/07/08/09. File lama (`src/lib/supabase.ts`, `src/auth/AuthProvider.tsx`, `src/pages/Masuk.tsx`, `src/pages/Beranda.tsx`, `src/App.tsx` routing) ikut terhapus bersama `src/` lama dan **tidak ada lagi**. Task 02 perlu dikerjakan ulang dari nol nanti: BLUEPRINT §2/§5 sekarang mensyaratkan `@supabase/ssr` dengan dua klien terpisah (`lib/supabase/client.ts` browser, `lib/supabase/server.ts` cookie-based) menggantikan satu klien `@supabase/supabase-js` + localStorage yang lama, dan routing lewat App Router menggantikan React Router. Status Task 02 dikembalikan ke ⬜ di tabel bawah.

**Verifikasi ulang setelah pindah** (bukan cuma "berhasil di-copy", logika dijalankan ulang):
- `buildZodSchema()` dites lagi dengan 3 kasus yang sama persis seperti sebelum migrasi (centang tanpa bukti → ditolak dengan pesan sama; dengan bukti → lolos; tidak dicentang → lolos). Hasil identik.
- SSR (`renderToStaticMarkup`) FormRenderer dengan ke-10 tipe field + `nilaiAwal`, dari lokasi baru. Uang terformat, lampiran nilaiAwal muncul, tabel 1 baris sesuai nilaiAwal, ke-10 field render — semua OK, sama seperti hasil sebelum migrasi.
- `npx tsc --noEmit`, `npm run build`, `npm run lint` ketiganya bersih pada kondisi akhir.
- `npm run dev` dijalankan sungguhan, `curl` ke `/` → HTTP 200, `<title>Pusat Kontrol Koperumnas Group</title>` dan `lang="id"` terkonfirmasi ada di HTML yang sungguh-sungguh dikirim server.

**`.env.local`/`.env.local.example` diganti nama variabel** `VITE_SUPABASE_*` → `NEXT_PUBLIC_SUPABASE_*` sesuai instruksi.

**Efek samping ditemukan & diperbaiki selama migrasi** (tidak diminta eksplisit, tapi blocking/salah kalau dibiarkan):
- `.gitignore` sempat tertimpa total oleh punya scaffold Next.js (termasuk pola `.env*` yang akan meng-ignore `.env.local.example` yang justru harus ter-track) — digabung ulang manual.
- Warning `turbopack.root` ambigu karena ada `package-lock.json` tak terkait di folder induk (di luar repo ini) — diberesi dengan `turbopack.root` eksplisit di `next.config.ts`, bukan menyentuh file di luar repo.

| # | Task | Status | Diverifikasi | Catatan |
|---|---|---|---|---|
| 01 | Fondasi proyek & token desain | ✅ | Dipindah ke Next.js: `npx tsc --noEmit`, `npm run build`, `npm run lint` bersih; `npm run dev` + `curl` ke `/` → HTTP 200, `<title>` dan `lang="id"` terkonfirmasi di HTML sungguhan. | **Di-scaffold ulang total dari Vite ke Next.js 16** (21 Agustus 2026) — lihat bagian "Migrasi stack" di atas. `tokens.css` pindah ke `app/tokens.css`, font Google lewat `next/font/google` (bukan `<link>`), `index.html` digantikan `app/layout.tsx`. |
| 02 | Klien Supabase & sesi login | ⬜ (dikerjakan ulang — implementasi Vite lama terhapus) | — | Implementasi lama (`src/lib/supabase.ts`, `AuthProvider.tsx`, halaman Masuk/Beranda, routing react-router) **sengaja tidak dipindah** ke Next.js — di luar scope 5 langkah migrasi yang diminta, dan arsitekturnya berubah total: BLUEPRINT §2/§5 sekarang mensyaratkan `@supabase/ssr` dua-klien (`lib/supabase/client.ts` + `lib/supabase/server.ts`, sesi lewat cookie) menggantikan satu klien localStorage lama, plus App Router menggantikan React Router. Perlu dikerjakan dari nol sebagai Task 02 versi Next.js. |
| 03 | Migrasi database — tabel inti | 🟨 SQL siap, menunggu dijalankan user | `supabase/migrations/0001_init.sql` ditulis lalu **diverifikasi lewat `diff` baris-per-baris** terhadap teks SQL persis di `04-CATATAN-TEKNIS.md` §1–§2 — cocok 100%, satu-satunya beda adalah komentar pemisah yang saya tambahkan. Belum dijalankan ke Supabase sungguhan (tidak ada akses DB dari sesi ini). | Menunggu user menjalankan di SQL Editor dan konfirmasi tabel muncul. |
| 04 | Row Level Security | 🟨 SQL siap, menunggu dijalankan + matriks uji user | `supabase/migrations/0002_rls.sql` ditulis lalu **diverifikasi lewat `diff`** terhadap `04-CATATAN-TEKNIS.md` §3.1–§3.3, §3.5 — cocok 100% kecuali satu deviasi yang memang **disengaja oleh spesifikasi sendiri**: policy `report_nudge` sengaja TIDAK dipasang (diganti RPC `tagih_laporan`), persis sesuai peringatan eksplisit di dokumen. §3.4 (security_invoker) belum relevan karena view belum ada (menyusul Task 20/0004_views.sql) — dicatat sebagai komentar pengingat di file migrasi. | Belum dijalankan ke Supabase sungguhan. Matriks uji 4-poin Task 04 **butuh akun uji nyata (M9)** karena `profile.id` terikat FK ke `auth.users` — tidak bisa disimulasikan dengan UUID palsu. Menunggu user menjalankan migrasi + M9 sebelum matriks bisa dijalankan dan hasil mentahnya ditempel. |
| 05 | Seed `policy`, lokasi, outlet | ⬜ | | |
| 06 | Kerangka layout, routing, penjaga peran | ⬜ | | |
| 07 | Tipe `FormSchema` + `FormRenderer` | ✅ | Dipindah ke `forms/types.ts`, `forms/index.ts`, `components/FormRenderer.tsx` (+ `'use client'`). `tsc`/`build`/`lint` bersih. SSR ulang setelah pindah — 10 field render, sama seperti sebelumnya (lihat "Migrasi stack"). | **Masih berlaku dari sebelum migrasi**: perilaku submit → `console.log` interaktif di browser sungguhan belum diuji live (tidak ada tool browser/DOM headless di sesi ini) — lihat CHECKPOINT 4. |
| 08 | Komponen field | ✅ | Dipindah ke `components/fields/*.tsx`, semua + `'use client'`. `tsc`/`build`/`lint` bersih (setelah menonaktifkan false-positive `react-hooks/refs`, lihat "Migrasi stack"). SSR ulang: Uang terformat, StatusWarna/YaTidak/Lampiran/Tabel baca `nilaiAwal` dengan benar — sama seperti sebelum migrasi. | **Masih berlaku dari sebelum migrasi**: readback field tak-terkontrol di browser sungguhan dan uji viewport 360px belum diamati langsung — lihat CHECKPOINT 4. |
| 09 | Aturan bukti wajib | ✅ | Dipindah ke `forms/validasi.ts`. `buildZodSchema().safeParse()` dites ulang 3 kasus di lokasi baru — hasil identik dengan sebelum migrasi, termasuk teks pesan `"Live dicentang tapi belum ada bukti"`. | **Masih berlaku dari sebelum migrasi**: highlight merah muda & `scrollIntoView` belum diamati di browser sungguhan — lihat CHECKPOINT 4. Keputusan desain `buktiWajib` (tombol menempel di baris field, path `_bukti.<fieldKey>`) tidak berubah, sudah dikonfirmasi user sebelumnya. |
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

## Utang uji — CHECKPOINT 4 (verifikasi browser sungguhan)

Belum bisa diuji di sesi ini karena tidak ada tool browser/DOM headless. Bukan diklaim selesai — **wajib dicek ulang saat sampai CHECKPOINT 4**, sebelum lanjut ke batch berikutnya:

- Interaksi submit form → `onSubmit` benar-benar terpanggil dengan data yang benar, diklik sungguhan di browser (Task 07)
- Readback nilai *default* untuk field tak-terkontrol berbasis `register()` (angka, teks, teks_panjang, pilih, centang, isi sel tabel) — bergantung pada `useEffect` react-hook-form yang tidak jalan di SSR (Task 08)
- Field `tabel` tidak menyebabkan scroll horizontal di lebar 360px — baru diverifikasi lewat tinjauan kode (`flex-col`), bukan tangkapan layar viewport sungguhan (Task 08)
- Highlight latar merah muda pada baris field yang gagal validasi (Task 09)
- `scrollIntoView` ke field bermasalah pertama saat validasi gagal (Task 09)
- Submit benar-benar tertahan (tidak memanggil `onSubmit`) saat validasi zod gagal — disimpulkan dari cara kerja `handleSubmit`, belum diamati langsung (Task 09)

## Utang uji (jangan sampai hilang)

- **Matriks RLS #3** (`select * from v_keuangan_rekap` sebagai `pusat` → harap 4 kolom saja, tanpa saldo bank) — **belum bisa diuji**, view-nya belum ada. Uji ulang begitu `0004_views.sql` dibuat (Task 20).
- **Matriks RLS #10** (buka path storage orang lain tanpa signed URL → harap ditolak) — **belum bisa diuji**, butuh baris nyata di `storage.objects` dari unggahan sungguhan. Uji ulang begitu unggah lampiran jalan (Task 11).

## Catatan lintas-task

- `docs/REFERENSI-FORMAT-LAPORAN.md` yang dirujuk `CLAUDE.md` dan `BLUEPRINT.md` **tidak ada** di folder `docs/`. Yang ada hanya `docs/02-FORMAT-LAPORAN-DIVISI-BARU.md`, isinya cuma 9 dari 15 format (HRD, Security, Perizinan, Pembangunan, DTI, Kendaraan, PIC Lokasi, CS, GA). Format "sudah berjalan" (Personal Marketing, Pusat, Accounting, IT, Manager Resto, Ita) belum ada sumbernya di manapun. Ini akan memblokir Task 12, 14 (sebagian: `it`), 16, 17 sampai dokumen ini disediakan.
- `docs/MODE-OTONOM.md` yang dirujuk instruksi awal tidak ada. Urutan batch & aturan checkpoint diambil dari prompt pertama user langsung, dikonfirmasi user.
- `CLAUDE.md` awalnya ditemukan di `docs/CLAUDE.md`, dipindahkan ke root proyek atas konfirmasi user.
- `docs/01-SPESIFIKASI-SISTEM.md` adalah dokumen LAMA yang sudah digantikan `BLUEPRINT.md` — isinya bertentangan (mengusulkan tabel `laporan_field` bergaya EAV, sedangkan BLUEPRINT memutuskan data laporan disimpan JSONB di `report.data`). Dipindahkan ke `docs/arsip/` atas instruksi user. **Jangan pernah dipakai sebagai acuan.**
- `docs/02-PROMPT-PACK.md` adalah prompt untuk manusia menempel ke agent, bukan dokumen untuk dibaca agent. Dilewati.
- `docs/05-RENCANA-FASE-2.md` adalah rencana setelah Fase 1 selesai. Belum dibaca, jangan dikerjakan sekarang.
