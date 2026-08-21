# 02 — PROMPT PACK

> Prompt siap tempel ke Claude Code. Satu prompt per task.
> Tempel apa adanya. Jangan disingkat — bagian "jangan" dan "selesai kalau" yang menjaga agent tidak melebar.

**Cara pakai**

```bash
cd koperumnas-laporan
claude
```

Tempel **P0** dulu, sekali saja. Setelah itu tempel P01, tunggu selesai, review, commit, baru P02. Jangan menempel dua task sekaligus.

---

## P0 · Pembuka sesi (tempel sekali di awal)

```
Kamu akan membangun sistem laporan harian untuk Koperumnas Group.

Baca file berikut secara berurutan sebelum menulis kode apa pun:
1. docs/BLUEPRINT.md
2. docs/04-CATATAN-TEKNIS.md
3. docs/03-CALC-SPEC.md
4. docs/01-TASK-BOARD.md
5. docs/REFERENSI-FORMAT-LAPORAN.md

Aturan kerja kita:
- Kerjakan SATU task per instruksi saya. Jangan lanjut ke task berikutnya tanpa saya minta.
- Sebelum menulis kode, jelaskan rencanamu dalam maksimal 8 baris dan tunggu saya setuju.
- Setiap selesai task, laporkan bagian "Selesai kalau" mana yang sudah kamu verifikasi dan bagaimana caranya.
- Semua teks antarmuka berbahasa Indonesia.
- Semua perhitungan tanggal memakai zona Asia/Jakarta, bukan UTC.
- Jangan memasang library di luar yang tertulis di BLUEPRINT.md tanpa bertanya dulu.
- Kalau ada yang tidak jelas di dokumen, tanya saya. Jangan menebak lalu jalan terus.

Setelah membaca semuanya, ringkas dalam 5 baris: apa yang dibangun, stack-nya, dan tiga keputusan arsitektur yang paling penting. Lalu berhenti dan tunggu instruksi saya.
```

---

## P01 · Fondasi proyek

```
Kerjakan TASK 01 di docs/01-TASK-BOARD.md.

Buat app/tokens.css dari palet di docs/04-CATATAN-TEKNIS.md §6 dan impor di app/layout.tsx. Buat struktur folder dari §5. Pasang tiga font Google lewat next/font/google di layout, jangan pakai tag <link> manual.

Jangan pasang UI kit, library ikon, atau React Router. Jangan buat komponen apa pun selain yang diperlukan untuk membuktikan token dan font sudah jalan.

Setelah selesai, jalankan npm run build dan tunjukkan hasilnya.
```

## P02 · Klien Supabase & sesi login

```
Kerjakan TASK 02.

Pakai @supabase/ssr, bukan createClient biasa. Buat lib/supabase/client.ts (createBrowserClient), lib/supabase/server.ts (createServerClient + cookies dari next/headers), middleware.ts di root untuk menyegarkan sesi dan mengalihkan yang belum login, lib/auth/AuthProvider.tsx, dan app/masuk/page.tsx.

AuthProvider harus menyediakan: session, profile, roles (string[]), assignments, loading, signIn, signOut. Setelah login berhasil, ambil profile, role, dan assignment milik user dalam satu putaran.

Sesi disimpan di cookie, bukan localStorage — kalau tidak, Server Component tidak bisa membaca siapa yang login.

SEBELUM menulis kode, buka dan ikuti panduan resmi Supabase untuk Next.js 16:
https://supabase.com/docs/guides/getting-started/ai-prompts/nextjs-supabase-auth

Dua hal yang WAJIB kamu pastikan, karena pola lamanya masih banyak beredar:
- cookies() itu ASINKRON. Wajib: const cookieStore = await cookies()
- Handler cookie HANYA getAll dan setAll. Pola get/set/remove sudah usang dan
  akan MERUSAK aplikasi. Kalau kamu terdorong menulis get(name) atau
  remove(name), berhenti — itu tandanya kamu memakai pola Next.js 14.

Lihat juga docs/04-CATATAN-TEKNIS.md §7 poin 9-11 untuk contoh kode lengkapnya.

Terjemahkan pesan error Supabase ke Bahasa Indonesia — jangan tampilkan "Invalid login credentials" mentah.

Jangan bikin halaman daftar/registrasi. Akun hanya dibuat admin.
```

## P03 · Migrasi database

```
Kerjakan TASK 03.

Buat supabase/migrations/0001_init.sql. Isinya PERSIS seperti docs/04-CATATAN-TEKNIS.md §1 dan §2 — jangan menambah, mengurangi, atau mengganti nama tabel/kolom.

Kalau menurutmu ada yang salah atau kurang di skema itu, JANGAN diperbaiki sendiri. Berhenti, tunjukkan mana yang menurutmu bermasalah, dan tunggu jawaban saya.

Setelah file dibuat, tampilkan isinya lengkap supaya saya bisa tempel ke Supabase SQL Editor.
```

## P04 · Row Level Security

```
Kerjakan TASK 04. Ini task paling kritis di proyek ini.

Buat supabase/migrations/0002_rls.sql sesuai docs/04-CATATAN-TEKNIS.md §3.

Persyaratan mutlak: laporan dengan form_key = 'accounting' hanya boleh terbaca oleh role 'ceo' dan oleh penulisnya sendiri. Role 'pusat' TIDAK BOLEH bisa membacanya, sekali pun.

Setelah menulis policy, tuliskan juga skrip uji SQL yang membuktikan keempat pengujian di bagian "Selesai kalau" TASK 04. Skrip itu harus bisa saya jalankan langsung di SQL Editor.

Jangan pernah menyarankan mematikan RLS untuk mempermudah pengembangan.
```

## P05 · Seed

```
Kerjakan TASK 05.

Buat supabase/migrations/0003_seed.sql berisi seluruh kunci policy dari docs/03-CALC-SPEC.md §1, plus 3 lokasi (Ciwidey, Pangalengan, Soreang) dan 2 outlet (Indosteak, Indokopi).

Buat juga hook usePolicy() di src/api/policy.ts yang membaca tabel policy dan meng-cache-nya dengan TanStack Query, staleTime 5 menit.

Setelah ini, tidak boleh ada satu pun angka aturan bisnis (500000, 300000, 20, 2) yang tertulis langsung di kode React. Semua lewat usePolicy().
```

## P06 · Layout & routing

```
Kerjakan TASK 06.

Buat header bergaya kop gambar teknik di app/layout.tsx, folder rute di app/ sesuai task board, dan komponen penjaga <Terlindungi peran="...">.

Perhatikan batas server/client: layout dan page penyusun tata letak tetap Server Component. Header yang punya tab peran interaktif dipecah jadi komponen ber-'use client' tersendiri — jangan menjadikan seluruh layout client hanya karena satu bagian butuh useState.

Tab peran hanya menampilkan peran yang benar-benar dimiliki user — jangan tampilkan lalu dinonaktifkan.

Mobile-first: sasaran sentuh minimal 44px, dan pada lebar 360px tidak boleh ada scroll horizontal. Buktikan dengan mengecek di lebar itu.

Acuan tampilan ada di prototipe-koperumnas.html kalau file itu ada di root. Ambil arah desainnya, bukan kodenya mentah-mentah.
```

## P07 · FormSchema & FormRenderer

```
Kerjakan TASK 07.

Buat src/forms/types.ts persis seperti tipe di TASK 07, lalu src/components/FormRenderer.tsx dan src/forms/index.ts.

Ini fondasi 15 form. Prioritaskan supaya menambah field cukup dengan mengubah file schema, tanpa menyentuh komponen sama sekali.

Buat satu schema uji berisi 3 field untuk membuktikannya. Jangan buat schema form asli dulu.
```

## P08 · Komponen field

```
Kerjakan TASK 08.

Buat satu komponen per FieldType di src/components/fields/.

Yang paling sering salah, tolong perhatikan:
- 'uang' menampilkan Rp1.234.567 saat blur, tapi yang disimpan integer polos tanpa titik
- 'angka' pakai inputMode="numeric" supaya HP memunculkan papan tombol angka
- 'tabel' di HP tampil sebagai kartu bertumpuk, BUKAN tabel yang perlu digeser ke samping
- 'lampiran' pakai accept="image/*,video/*" dan atribut capture

Uji semuanya di lebar 360px.
```

## P09 · Aturan bukti wajib

```
Kerjakan TASK 09.

Bangun validasi zod dinamis dari schema. Aturannya: field ber-buktiWajib yang dicentang atau diisi tapi tidak punya lampiran akan menolak submit.

Pesan error dikumpulkan di atas tombol kirim, berbahasa Indonesia, menyebut nama field. Contoh: "Live dicentang tapi belum ada bukti".

Baris bermasalah diberi latar merah muda dan di-scroll ke tampilan.

Ini menegakkan aturan tertulis klien: tidak cukup hanya menulis "sudah", harus ada bukti. Jangan buat jalan pintas untuk melewatinya.
```

## P10 · Draft & kirim

```
Kerjakan TASK 10.

Buat src/api/report.ts dengan hook useReportHariIni, useSimpanDraft, useKirimReport.

Draft tersimpan otomatis ke Supabase 5 detik setelah user berhenti mengetik (debounce).

Saat kirim, tentukan status 'terkirim' atau 'terlambat' dengan membandingkan waktu WIB sekarang terhadap policy.deadline_by_form untuk form_key tersebut.

Kalau laporan hari ini sudah ada, buka isinya — jangan buat baris baru. Unique index sudah mencegahnya di database, tapi frontend juga tidak boleh mencoba.
```

## P11 · Unggah lampiran

```
Kerjakan TASK 11.

Unggah ke bucket 'bukti' privat, path {report_id}/{field_key}/{uuid}.{ext}, catat di tabel attachment.

Kompres gambar di browser sebelum unggah: sisi terpanjang maksimal 1600px, JPEG kualitas 0.8, pakai canvas. Jangan pasang library kompresi.

Video jangan dikompres. Cukup tolak yang lebih dari 50MB dengan pesan jelas berapa ukuran filenya.

Tampilkan file memakai signed URL berumur pendek. Jangan pernah membuat bucket jadi publik.

Ini akan dipakai satpam dan PIC lokasi dengan sinyal seadanya — tampilkan progres per file supaya mereka tahu prosesnya belum mati.
```

## P12 · Form personal marketing

```
Kerjakan TASK 12.

Buat schema f01-personal-marketing.ts dari docs/REFERENSI-FORMAT-LAPORAN.md, dan sinkronkan ke tabel pte_daily saat kirim, dengan rumus persis dari docs/03-CALC-SPEC.md §2.

Penting: angka "undangan ___ / 20" dan "closing ___ / 2" DIHITUNG SISTEM dari akumulasi bulan berjalan. Jangan biarkan user mengetiknya sendiri — di format lama memang diketik manual, tapi di sistem baru itu harus dihitung.

Target 20 dan 2 diambil dari tabel policy, bukan angka di kode.
```

## P13 · Form PIC lokasi

```
Kerjakan TASK 13.

Buat schema f13-pic-lokasi.ts. Scope lokasi: kalau user punya lebih dari satu assignment lokasi, minta dia pilih lokasi dulu sebelum form muncul.

Blok terakhir "Butuh keputusan CEO": kalau dicentang dan judulnya terisi, buat satu baris di tabel decision saat laporan dikirim. Urgensi 1 kalau status laporan merah, selain itu 2.

Foto/video progress pembangunan wajib setiap hari — set buktiWajib: true dan pastikan kirim tanpa itu ditolak.
```

## P14 · Form IT, HRD, Security, Perizinan

```
Kerjakan TASK 14. Buat empat schema sekaligus dari docs/REFERENSI-FORMAT-LAPORAN.md.

Khusus security: scope-nya lokasi DAN shift (pagi/siang/malam), jadi satu lokasi bisa punya tiga laporan di hari yang sama. Pastikan unique index tidak menolaknya — kalau perlu penyesuaian skema, berhenti dan tanya saya dulu.

Setelah selesai, buka Papan Kontrol dan pastikan keempatnya muncul sebagai kartu.
```

## P15 · Form pembangunan, DTI, kendaraan, CS, GA

```
Kerjakan TASK 15. Lima schema dari referensi.

Pasang blok "Butuh keputusan CEO" di kelimanya, pakai komponen yang sama persis dengan TASK 13 — jangan disalin ulang, ekstrak jadi komponen bersama.
```

## P16 · Form manager resto & Ita

```
Kerjakan TASK 16.

manager_resto: scope outlet, termasuk 10 video kontrol wajib. Kurang satu video pun, kirim ditolak.

ita: blok Stock Opname HANYA muncul hari Senin menurut zona Asia/Jakarta. Cek harinya di WIB, bukan waktu lokal browser — PIC bisa saja bepergian.

Di kedua form: kalau field selisih diisi bukan nol, field penyebab jadi wajib. Prinsip klien: tidak boleh ada selisih tanpa penjelasan.
```

## P17 · Form accounting

```
Kerjakan TASK 17.

Buat f03-accounting.ts dengan rahasia: true. Beri penanda CONFIDENTIAL — CEO di header form.

Batasi akses di dua lapisan: UI menyembunyikan menu, dan RLS menolak query. Jangan hanya mengandalkan UI.

Setelah selesai, buktikan ke saya: login sebagai akun ber-role pusat, jalankan query select ke report dengan form_key accounting, dan tunjukkan hasilnya 0 baris.
```

## P18 · Papan Kontrol

```
Kerjakan TASK 18.

Daftar "laporan yang ditunggu hari ini" dihitung dari tabel assignment, BUKAN dari array tetap di kode. Menambah PIC baru di admin harus langsung menambah kartu tanpa deploy ulang.

Kartu belum lapor: garis putus-putus, abu-abu, teks "belum lapor".
Kartu sudah lapor: warna dari report.warna, jam kirim di kaki kartu.

Hari yang bukan hari kerja menurut policy.workdays: papan kosong dengan pesan "Hari ini bukan hari wajib lapor" — jangan tampilkan semua orang sebagai telat.

Acuan tampilan: papan kontrol di prototipe-koperumnas.html.
```

## P19 · Antrean keputusan

```
Kerjakan TASK 19.

Daftar decision status menunggu, urut urgensi lalu deadline. Tombol Setujui/Cicil/Tunda/Tolak plus kolom catatan. Simpan decided_by dan decided_at.

Hanya role ceo yang bisa memutuskan. Role pusat boleh melihat dan mengubah urutan prioritas saja.

Pastikan pembatasan ini juga ada di RLS — kalau policy update untuk tabel decision belum membatasi ke ceo, tambahkan migrasinya sekarang.
```

## P20 · View agregasi & dashboard CEO

```
Kerjakan TASK 20.

Buat supabase/migrations/0004_views.sql berisi view dari docs/03-CALC-SPEC.md §4, lalu dashboard angka CEO.

Semua angka diambil dari view. Jangan ada agregasi yang dihitung ulang di React — kalau ada dua tempat menghitung hal yang sama, cepat atau lambat hasilnya akan beda.

Tangani keadaan kosong: kalau belum ada laporan hari itu, tampilkan garis "—", bukan 0 atau NaN. Nol dan "belum ada data" artinya beda untuk CEO.
```

## P21 · Laporan Terpusat Sabrina

```
Kerjakan TASK 21.

17 bagian sesuai format klien. Bagian 1 sampai 15 HANYA BACA, terisi dari view, dengan label kecil sumbernya seperti "dari F-04 IT · 08.12".

Bagian 16 (target besok), 17 (prioritas keputusan), dan Kesimpulan bisa diisi Sabrina.

Bagian 11 Keuangan: role pusat hanya melihat 4 angka (total masuk, total keluar, net, status warna). Role ceo melihat versi lengkap. Ini bukan sekadar tampilan — pastikan datanya memang tidak terkirim ke browser role pusat.

Tambahkan tombol cetak memakai window.print dan CSS @media print yang muat A4.
```

## P22 · Dashboard kontrol marketing

```
Kerjakan TASK 22.

Tabel karyawan x kepatuhan bulan berjalan dari view v_marketing_bulanan. Kolom: undangan/20, closing/2, hari PTE bolong, status PTE Rp500.000, status potongan Rp300.000.

Bisa disaring per divisi dan diurutkan berdasarkan yang paling tertinggal — Pak Fauzi dan Pak Dea butuh melihat siapa yang harus dikejar hari ini, bukan daftar alfabet.

Detail per karyawan: kalender bulan berjalan, hari bolong ditandai merah.

Akses: hanya kontrol_marketing, ceo, pusat.
```

## P23 · Halaman admin

```
Kerjakan TASK 23.

CRUD untuk profile, role, assignment, lokasi, outlet, policy. Hanya role ceo.

Pembuatan user baru butuh service_role key. Buat Route Handler di app/api/admin/user/route.ts yang membaca process.env.SUPABASE_SERVICE_ROLE_KEY — TANPA awalan NEXT_PUBLIC_. Halaman admin memanggilnya lewat fetch.

Periksa sekali lagi sebelum lapor: pastikan tidak ada satu pun file ber-'use client' yang menyentuh kunci itu, dan pastikan awalan NEXT_PUBLIC_ tidak terpasang di depannya. Salah satu saja dari dua hal itu membocorkan seluruh database.

Uji: tambah lokasi baru, assign PIC, lalu buka Papan Kontrol — kartunya harus langsung ada.
```

## P24 · Uji RLS & deploy

```
Kerjakan TASK 24.

Buat 5 akun uji (ceo, pusat, accounting, pic_lokasi, karyawan), jalankan seluruh matriks uji di docs/04-CATATAN-TEKNIS.md §4, dan laporkan hasilnya satu per satu dalam bentuk tabel: skenario, harapan, hasil, lolos/gagal.

Kalau ada satu saja yang gagal, perbaiki dan ulangi seluruh matriks. Jangan lanjut deploy dengan catatan "nanti diperbaiki".

Setelah semuanya hijau, jalankan npm run build, pastikan tanpa error TypeScript, lalu pandu saya langkah demi langkah untuk deploy ke Vercel.
```

---

## Prompt bantuan

**Kalau agent melebar dari task**

```
Berhenti. Kamu sedang mengerjakan hal di luar TASK ___. Kembalikan perubahan yang di luar cakupan itu, dan selesaikan hanya bagian "Selesai kalau" yang tertulis di task board.
```

**Kalau agent menaruh angka aturan bisnis di kode**

```
Kamu menulis angka aturan bisnis langsung di kode. Semua nilai seperti itu harus dari tabel policy lewat usePolicy(). Cari seluruh kejadian serupa di proyek dan perbaiki semuanya, bukan hanya yang ini.
```

**Kalau agent menyarankan mematikan RLS**

```
Tidak. RLS tidak boleh dimatikan pada tahap mana pun. Laporan Accounting bersifat rahasia terhadap seluruh peran selain CEO. Selesaikan masalahnya dengan memperbaiki policy, bukan dengan mematikannya.
```

**Review sebelum commit**

```
Sebelum saya commit, periksa pekerjaanmu di task ini:
1. Ada angka aturan bisnis yang ter-hardcode?
2. Ada perhitungan tanggal yang tidak memakai Asia/Jakarta?
3. Ada teks antarmuka yang masih Bahasa Inggris?
3b. Ada komponen yang memakai hook tapi lupa 'use client'? Ada yang diberi 'use client' padahal tidak perlu?
4. Ada pembatasan akses yang hanya ada di UI tapi tidak di RLS?
5. Apakah tampilannya masih rapi di lebar 360px?
Jawab satu per satu dan tunjukkan barisnya.
```
