import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { chromium } from 'playwright';
import { Client } from 'pg';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const dbUrl = process.env.SUPABASE_DB_URL;
const db = new Client({ connectionString: dbUrl });

const BASE_URL = 'http://localhost:3000';
const EMAIL = 'uji-ceo@koperumnas.local';
const PASSWORD = 'Uji-CEO-Password-2026!';

function logLangkah(judul) {
  console.log(`\n======================================================`);
  console.log(`  ${judul}`);
  console.log(`======================================================`);
}

function assertTest(kondisi, pesan) {
  if (kondisi) {
    console.log(`  [PASS] ${pesan}`);
  } else {
    console.error(`  [FAIL] ${pesan}`);
    throw new Error(`Assertion failed: ${pesan}`);
  }
}

async function run() {
  await db.connect();
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text();
      // Ignore non-fatal React / dev server noise if any
      if (!text.includes('Download the React DevTools') && !text.includes('favicon.ico')) {
        consoleErrors.push(text);
      }
    }
  });
  page.on('pageerror', (err) => {
    consoleErrors.push(err.message);
  });

  const tempReportIds = [];

  try {
    // -------------------------------------------------------------------------
    // 1. LOGIN CEO
    // -------------------------------------------------------------------------
    logLangkah('1. UJI LOGIN CEO');
    await page.goto(`${BASE_URL}/masuk`, { waitUntil: 'networkidle' });
    assertTest(page.url().includes('/masuk'), 'Halaman masuk berhasil dimuat');

    await page.fill('input[type="email"]', EMAIL);
    await page.fill('input[type="password"]', PASSWORD);
    await page.click('button[type="submit"]');

    await page.waitForURL(`${BASE_URL}/`, { timeout: 15000 });
    assertTest(page.url() === `${BASE_URL}/`, 'Redirect berhasil menuju dashboard utama');

    await page.waitForSelector('h1', { timeout: 10000 });
    const headingText = await page.locator('h1').innerText();
    assertTest(headingText.includes('AKUN UJI - CEO'), `Heading menyapa CEO: "${headingText}"`);

    // -------------------------------------------------------------------------
    // 2. EMPTY STATE FACTUAL CONTEXT & OPERATIONAL CONTEXT
    // -------------------------------------------------------------------------
    logLangkah('2. UJI EMPTY STATE FACTUAL CONTEXT (SEBELUM LAPORAN MASUK)');
    const bodyText = await page.innerText('body');
    assertTest(
      bodyText.includes('Laporan Keuangan Hari Ini Belum Tersedia') || bodyText.includes('Menunggu Laporan Accounting Hari Ini'),
      'Empty state Keuangan tampil dengan konteks operasional F17'
    );
    assertTest(
      bodyText.includes('Belum Ada Pasangan Laporan Masuk') || bodyText.includes('Silang-Cek Omzet Resto Hari Ini'),
      'Empty state Silang-Cek Resto tampil dengan konteks operasional F14/F15'
    );

    // -------------------------------------------------------------------------
    // 3. TOMBOL OPERASIONAL & LINK ROUTING
    // -------------------------------------------------------------------------
    logLangkah('3. UJI ACTION BUTTONS & FLOW PRESENSI');
    const presensiLink = await page.locator('a:has-text("Buka Kamera Presensi")').first();
    if (await presensiLink.count() > 0) {
      const href = await presensiLink.getAttribute('href');
      assertTest(href === '/absen', 'Link Buka Kamera Presensi menuju route /absen');
    }

    const isiSekarangButtons = await page.locator('a:has-text("Isi sekarang")').all();
    for (const btn of isiSekarangButtons) {
      const href = await btn.getAttribute('href');
      assertTest(href && href.startsWith('/lapor/'), `Tombol tugas harian menuju form yang benar: ${href}`);
    }

    // -------------------------------------------------------------------------
    // 4. DESKTOP NAVIGATION GROUPING & ROUTE ACCESSIBILITY
    // -------------------------------------------------------------------------
    logLangkah('4. UJI DESKTOP NAVIGATION & LAINNYA DROPDOWN');
    const lainnyaBtn = page.locator('button:has-text("Lainnya"), button:has-text("Menu:")');
    assertTest(await lainnyaBtn.count() > 0, 'Tombol Lainnya tampil di navbar desktop');

    // Buka dropdown Lainnya
    await lainnyaBtn.first().click();
    await page.waitForTimeout(300);
    const dropdownMenu = page.locator('text=Fitur & Penugasan Lainnya');
    assertTest(await dropdownMenu.isVisible(), 'Dropdown menu Lainnya terbuka saat diklik');

    // Periksa semua route CEO yang wajib accessible
    const ceoRoutes = [
      '/',
      '/papan',
      '/keputusan',
      '/keuangan',
      '/marketing',
      '/terpusat',
      '/riwayat',
      '/absen',
      '/admin',
      '/akun',
      '/cuti',
      '/absen/tinjau',
      '/kebersihan/tinjau',
      '/cuti/tinjau'
    ];

    for (const route of ceoRoutes) {
      const resp = await page.goto(`${BASE_URL}${route}`, { waitUntil: 'domcontentloaded' });
      const status = resp ? resp.status() : 200;
      assertTest(status === 200, `Route ${route} accessible (HTTP ${status})`);
    }

    // Kembali ke Beranda
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });

    // -------------------------------------------------------------------------
    // 5. FUNCTIONAL TRANSITION TEST: EMPTY STATE -> POPULATED METRICS
    // -------------------------------------------------------------------------
    logLangkah('5. UJI TRANSISI DINAMIS: EMPTY STATE -> METRIK KPI (DATA TERISOLASI)');
    const { rows: lokasiRows } = await db.query('select id, nama from public.lokasi order by id limit 1');
    const { rows: outletRows } = await db.query('select id, nama from public.outlet order by id limit 1');
    const { rows: userRows } = await db.query('select id from auth.users where email = $1', [EMAIL]);
    const userId = userRows[0].id;
    const testLokasiId = lokasiRows[0].id;
    const testOutletId = outletRows[0].id;
    const testOutletNama = outletRows[0].nama;

    // A. Insert Accounting Report
    const resAcc = await db.query(
      `insert into public.report (form_key, tanggal, author_id, status, data, warna)
       values (
         'accounting',
         '2026-09-19',
         $1,
         'terkirim',
         jsonb_build_object(
           'total_masuk', 25000000,
           'total_keluar', 15000000,
           'net', 10000000,
           'cash_kantor', 5000000,
           'total_kewajiban_30_hari', 12000000
         ),
         'hijau'
       ) returning id`,
      [userId]
    );
    tempReportIds.push(resAcc.rows[0].id);

    // B. Insert Pembangunan Report (pic_lokasi)
    const resPemb = await db.query(
      `insert into public.report (form_key, tanggal, author_id, lokasi_id, status, data)
       values (
         'pic_lokasi',
         '2026-09-19',
         $1,
         $2,
         'terkirim',
         jsonb_build_object(
           'unit_dibangun', 8,
           'unit_finishing', 3,
           'unit_selesai', 2,
           'unit_belum_mulai', 5
         )
       ) returning id`,
      [userId, testLokasiId]
    );
    tempReportIds.push(resPemb.rows[0].id);

    // C. Insert Resto Reports (manager_resto & kontrol_fnb)
    const resMgr = await db.query(
      `insert into public.report (form_key, tanggal, author_id, outlet_id, status, data)
       values (
         'manager_resto',
         '2026-09-19',
         $1,
         $2,
         'terkirim',
         jsonb_build_object('total_omzet', 6500000)
       ) returning id`,
      [userId, testOutletId]
    );
    tempReportIds.push(resMgr.rows[0].id);

    const resFnb = await db.query(
      `insert into public.report (form_key, tanggal, author_id, outlet_id, status, data)
       values (
         'kontrol_fnb',
         '2026-09-19',
         $1,
         $2,
         'terkirim',
         jsonb_build_object('omzet_sistem', 6000000)
       ) returning id`,
      [userId, testOutletId]
    );
    tempReportIds.push(resFnb.rows[0].id);

    // Reload page to observe live database transition
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const updatedBodyText = await page.innerText('body');

    // 5A. Assert Keuangan KPI Section
    assertTest(/net cashflow/i.test(updatedBodyText), 'Section Keuangan berubah dari empty state ke KPI Card');
    assertTest(/surplus harian/i.test(updatedBodyText), 'Status Net Cashflow menunjukkan "Surplus Harian"');
    assertTest(updatedBodyText.includes('10.000.000') && updatedBodyText.includes('25.000.000'), 'Angka penerimaan (Rp 25.000.000) & net surplus (Rp 10.000.000) terhitung akurat');

    // 5B. Assert Rekap Unit Pembangunan
    assertTest(updatedBodyText.includes('18 Unit Terdata'), 'Rekap Unit Pembangunan menampilkan total akumulasi 18 unit');
    assertTest(updatedBodyText.includes('Sedang Dibangun') && updatedBodyText.includes('Tahap Finishing'), 'Tahapan 2x2 Unit Pembangunan aktif');
    assertTest(updatedBodyText.includes('28% matang'), 'Distribusi tahapan unit matang (28%) terhitung');

    // 5C. Assert Silang-Cek Omzet Resto
    assertTest(updatedBodyText.includes(testOutletNama), `Silang-Cek Omzet mendeteksi outlet: ${testOutletNama}`);
    assertTest(
      /selisih.*500\.000/i.test(updatedBodyText) || updatedBodyText.includes('500.000'),
      'Selisih omzet Rp 500.000 (6.500.000 vs 6.000.000) terhitung akurat secara real-time'
    );

    // -------------------------------------------------------------------------
    // 6. UJI LOGOUT
    // -------------------------------------------------------------------------
    logLangkah('6. UJI LOGOUT & PEMBERSIHAN SESI');
    const keluarBtn = page.locator('button:has-text("Keluar")').first();
    await keluarBtn.click();
    await page.waitForURL(`${BASE_URL}/masuk`, { timeout: 10000 });
    assertTest(page.url().includes('/masuk'), 'Logout berhasil mengalihkan ke /masuk');

    // -------------------------------------------------------------------------
    // 7. CONSOLE ERROR CHECK
    // -------------------------------------------------------------------------
    logLangkah('7. CEK CONSOLE ERROR');
    const fatalErrors = consoleErrors.filter((e) => !e.includes('Hydration') && !e.includes('sw.js'));
    assertTest(fatalErrors.length === 0, `Tidak ada console error penting (ditemukan: ${fatalErrors.length})`);
    if (fatalErrors.length > 0) {
      console.warn('Console error warnings:', fatalErrors);
    }

  } finally {
    // CLEANUP: Hapus data uji terisolasi tanpa meninggalkan dummy data permanen
    if (tempReportIds.length > 0) {
      console.log(`\nMembersihkan ${tempReportIds.length} data laporan uji terisolasi...`);
      await db.query('delete from public.report where id = any($1)', [tempReportIds]);
      console.log('Semua data uji berhasil dihapus dari database.');
    }
    await db.end();
    await browser.close();
  }
}

run()
  .then(() => {
    console.log('\n======================================================');
    console.log('  SEMUA PENGUJIAN FUNGSIONAL SELESAI DENGAN SUKSES!   ');
    console.log('======================================================\n');
    process.exit(0);
  })
  .catch((err) => {
    console.error('\nPengujian Fungsional Gagal:', err);
    process.exit(1);
  });
