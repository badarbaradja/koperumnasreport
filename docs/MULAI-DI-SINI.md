# MULAI DI SINI

> Halaman pertama yang dibuka saat memulai proyek. Ikuti urutannya, jangan dilompati.

---

## Bagian A — Anda kerjakan sendiri di terminal

Agent belum bisa apa-apa di folder kosong. Enam langkah ini manual.

```bash
# 1 · masuk ke folder (pastikan masih KOSONG)
cd reportkoperumnasgroup

# 2 · scaffold React + TypeScript
npx create-next-app@latest . --ts --app --tailwind --eslint --src-dir=false --import-alias "@/*" --no-turbopack
#    kalau ditanya "directory is not empty" → pilih lanjut, CLAUDE.md & docs/ tidak akan ditimpa

# 3 · pasang dependensi tambahan
npm install @supabase/supabase-js @supabase/ssr @tanstack/react-query react-hook-form zod @hookform/resolvers date-fns

# 4 · salin CLAUDE.md dan folder docs/ ke sini
#     hasil akhir harus begini:
#       reportkoperumnasgroup/CLAUDE.md
#       reportkoperumnasgroup/docs/BLUEPRINT.md
#       reportkoperumnasgroup/docs/00-SETUP-MANUAL.md
#       ... dst

# 5 · simpan sebagai commit pertama
git init
git add -A
git commit -m "fondasi: next.js + dokumen proyek"

# 6 · jalankan agent
claude
```

**Cek sebelum lanjut:** `ls` harus memperlihatkan `CLAUDE.md`, `docs/`, `package.json`, dan `src/`.

---

## Bagian B — Prompt pembuka untuk agent

Tempel **apa adanya**, sekali saja, sebagai pesan pertama di Claude Code.

```
Halo. Kamu akan membangun sistem laporan harian untuk Koperumnas Group di folder ini.

LANGKAH 1 — Baca dokumen berikut, berurutan, sebelum menulis kode apa pun:
  1. CLAUDE.md
  2. docs/BLUEPRINT.md
  3. docs/04-CATATAN-TEKNIS.md
  4. docs/03-CALC-SPEC.md
  5. docs/01-TASK-BOARD.md
  6. docs/00-SETUP-MANUAL.md
docs/REFERENSI-FORMAT-LAPORAN.md panjang — cukup baca daftar isinya dulu, detailnya
nanti saat mengerjakan form.

LANGKAH 2 — Periksa kesiapan folder ini, jangan diperbaiki dulu, cukup laporkan:
  - versi Node (butuh 18 ke atas)
  - apakah package.json sudah memuat semua dependensi di BLUEPRINT.md §2
  - apakah file .env.local ada dan berisi NEXT_PUBLIC_SUPABASE_URL & NEXT_PUBLIC_SUPABASE_ANON_KEY
  - apakah .env.local sudah masuk .gitignore
  - apakah folder docs/ lengkap 8 file

LANGKAH 3 — Laporkan ke saya dalam bentuk ini, maksimal 20 baris total:

  A. RINGKASAN (5 baris)
     Apa yang dibangun, stack-nya, dan 3 keputusan arsitektur paling penting.

  B. KESIAPAN
     Daftar hasil pemeriksaan langkah 2. Tandai ✅ atau ❌.

  C. YANG SAYA BUTUHKAN DARI KAMU
     Hal yang harus saya kerjakan manual sebelum kamu bisa mulai Task 01.
     Sebutkan nomor checklist-nya di docs/00-SETUP-MANUAL.md.

  D. RENCANA TASK 01
     Maksimal 5 baris, apa yang akan kamu kerjakan.

CARA KERJA KITA:
- Satu task per instruksi saya, berurutan dari docs/01-TASK-BOARD.md. Jangan lompat,
  jangan gabung dua task.
- Sebelum menulis kode, jelaskan rencana singkat dan tunggu saya bilang lanjut.
- Setelah selesai satu task, laporkan bagian "Selesai kalau" mana yang sudah kamu
  verifikasi dan bagaimana cara kamu memverifikasinya.
- Kalau ada yang tidak jelas di dokumen, TANYA. Jangan menebak lalu jalan terus.
- Kalau menurutmu ada yang salah di skema atau spesifikasi, berhenti dan tunjukkan.
  Jangan diperbaiki diam-diam.
- Semua teks antarmuka Bahasa Indonesia. Semua perhitungan tanggal zona Asia/Jakarta.

SEKARANG: kerjakan langkah 1–3, lalu BERHENTI dan tunggu instruksi saya.
Jangan menulis kode apa pun di pesan pertama ini.
```

---

## Bagian C — Setelah agent menjawab

1. Baca bagian **C. YANG SAYA BUTUHKAN DARI KAMU**. Biasanya isinya: buat proyek Supabase, isi `.env.local`, buat akun CEO. Kerjakan dulu sesuai `docs/00-SETUP-MANUAL.md`.
2. Kalau bagian **A. RINGKASAN** meleset dari isi BLUEPRINT, jangan lanjut — suruh baca ulang. Agent yang salah paham di awal akan salah terus sampai Task 24.
3. Kalau semuanya cocok, tempel **P01** dari `docs/02-PROMPT-PACK.md`.

---

## Urutan kalau Supabase belum siap

Task 01, 06, 07, 08, dan 09 tidak butuh Supabase sama sekali. Kalau proyek Supabase belum jadi, kerjakan dulu lima task itu, baru kembali ke Task 02.

Urutan alternatif: **01 → 07 → 08 → 09 → 02 → 03 → 04 → 05 → 06 → 10 →** seterusnya sesuai task board.

---

## Tanda agent mulai melenceng

Hentikan kalau melihat salah satu ini:

| Gejala | Prompt penghenti |
|---|---|
| Menulis komponen React terpisah per form | "Semua form harus lewat FormRenderer dari schema. Kembalikan perubahan ini." |
| Angka 500000 / 300000 / 20 / 2 muncul di file `.tsx` | Prompt "hardcode" di `docs/02-PROMPT-PACK.md` |
| Menyarankan `alter table ... disable row level security` | Prompt "RLS" di `docs/02-PROMPT-PACK.md` |
| Memakai `toISOString()` untuk tanggal | "Pakai tanggalWIB() dari lib/tanggal.ts. Cari semua kejadian serupa." |
| Mengerjakan 3 task sekaligus | "Berhenti. Selesaikan hanya TASK ___." |
| Memasang library di luar BLUEPRINT | "Copot. Stack sudah dikunci di BLUEPRINT.md §2." |


---

## Bagian D — Mode otonom (agent mengerjakan semuanya)

Kalau Anda ingin agent yang mengerjakan seluruhnya termasuk scaffolding, pakai prompt di
bawah ini sebagai ganti Bagian A dan B. Aturan batch dan checkpoint-nya ada di
`docs/MODE-OTONOM.md`.

Syarat: `CLAUDE.md` dan folder `docs/` sudah Anda salin ke folder proyek, dan Anda sudah
berada di dalam folder itu saat menjalankan `claude`.

```
Halo. Kamu akan membangun sistem laporan harian Koperumnas Group di folder ini,
dari nol sampai siap deploy. Aku ingin kamu kerjakan sebagian besar sendiri.

═══ LANGKAH 0 — PERIKSA DULU ═══
Jalankan: ls -la
Kalau CLAUDE.md atau folder docs/ TIDAK ada, BERHENTI dan bilang ke aku file apa
yang kurang. Jangan lanjut, jangan bikin sendiri isinya.

═══ LANGKAH 1 — BACA ═══
Berurutan: CLAUDE.md, docs/BLUEPRINT.md, docs/MODE-OTONOM.md,
docs/04-CATATAN-TEKNIS.md, docs/03-CALC-SPEC.md, docs/01-TASK-BOARD.md,
docs/00-SETUP-MANUAL.md.
docs/REFERENSI-FORMAT-LAPORAN.md panjang — baca daftar isinya saja dulu.

═══ LANGKAH 2 — SIAPKAN PROYEK ═══
Kerjakan sendiri, tanpa tanya:
  1. Scaffold Next.js TANPA prompt interaktif:
       npx create-next-app@latest . --ts --app --tailwind --eslint --src-dir=false \
         --import-alias "@/*" --no-turbopack
       JANGAN menimpa CLAUDE.md atau docs/
  2. npm install @supabase/supabase-js @supabase/ssr @tanstack/react-query \
       react-hook-form zod @hookform/resolvers date-fns
  4. Pastikan .gitignore memuat .env.local
  5. Buat .env.local.example berisi dua kunci kosong
     (NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY)
  6. git add -A, commit: "setup: next.js + dependensi"
  7. Buat docs/PROGRESS.md dengan daftar 24 task, semua ditandai belum selesai

═══ LANGKAH 3 — KERJAKAN BATCH A ═══
Task 01, 07, 08, 09 dari docs/01-TASK-BOARD.md. Empat task ini tidak butuh Supabase.
Kerjakan berurutan, jangan tanya di antara task. Setiap selesai satu task:
  - commit dengan pesan "TaskNN: ringkasan singkat"
  - update docs/PROGRESS.md: task, status, apa yang diverifikasi, catatan
  - jalankan npx tsc --noEmit dan npm run build, pastikan bersih

Selesai keempatnya, BERHENTI di CHECKPOINT 1 dan laporkan:
  A. Task mana yang selesai, dan bagian "Selesai kalau" mana yang kamu verifikasi
     — sebutkan CARA kamu memverifikasinya, bukan cuma klaim selesai
  B. Apa yang aku harus kerjakan manual sekarang, sebutkan nomor M-nya
  C. Rencana batch berikutnya, maksimal 5 baris
Lalu tunggu aku.

═══ BATCH BERIKUTNYA ═══
Setelah aku bilang lanjut, ikuti urutan batch di docs/MODE-OTONOM.md:
  BATCH B  = Task 02, 03, 04   → berhenti di CHECKPOINT 2
  BATCH C  = Task 05, 06, 10, 11, 12 → berhenti di CHECKPOINT 3
  BATCH D  = Task 13, 14, 15, 16, 17
  BATCH E  = Task 18–23 → berhenti di CHECKPOINT 4
  TASK 24  = uji menyeluruh + deploy, kerjakan bersama aku

Di CHECKPOINT 2 kamu WAJIB menjalankan seluruh matriks uji di
docs/04-CATATAN-TEKNIS.md §4 dan melaporkan hasilnya sebagai tabel:
skenario, harapan, hasil nyata, lolos/gagal. Kalau ada satu saja gagal, perbaiki
dan ulangi SELURUH matriks. Jangan lanjut dengan catatan "nanti diperbaiki".

═══ ATURAN SELAMA JALAN SENDIRI ═══
- Jangan pernah melewati checkpoint. Berhenti berarti berhenti.
- Jangan pernah mematikan RLS, dengan alasan apa pun.
- Jangan pernah menaruh service_role key di kode frontend.
- Jangan hardcode angka aturan bisnis (500000, 300000, 20, 2) — semua dari tabel policy.
- Jangan pakai toISOString() untuk tanggal — pakai helper zona Asia/Jakarta.
- Jangan menulis komponen React terpisah per form — semua lewat FormRenderer.
- Jangan pasang library di luar BLUEPRINT.md §2 tanpa tanya.
- Semua teks antarmuka Bahasa Indonesia.
- Kalau menurutmu ada yang SALAH di skema atau spesifikasi: BERHENTI, tunjukkan,
  tunggu jawabanku. Jangan diperbaiki diam-diam.
- Kalau kamu terpaksa memilih di antara dua tafsiran dokumen: pilih yang paling
  sederhana, catat pilihanmu di docs/PROGRESS.md, dan sebutkan saat lapor.
- Jangan melaporkan sesuatu selesai kalau kamu belum benar-benar menjalankannya.
  Aku lebih butuh tahu apa yang belum jalan daripada laporan yang rapi.

Sekarang kerjakan LANGKAH 0 sampai 3, lalu berhenti di CHECKPOINT 1.
```
