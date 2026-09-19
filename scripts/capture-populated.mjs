import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { Client } from 'pg';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const ARTIFACT_DIR = 'C:\\Users\\USER\\.gemini\\antigravity-ide\\brain\\319f1e55-114d-47b9-b1fc-88b9378d5e20';
const BASE_URL = 'http://localhost:3000';
const EMAIL = 'uji-ceo@koperumnas.local';
const PASSWORD = 'Uji-CEO-Password-2026!';

const db = new Client({ connectionString: process.env.SUPABASE_DB_URL });
await db.connect();

const tempReportIds = [];

try {
  const { rows: lokasiRows } = await db.query('select id, nama from public.lokasi order by id limit 1');
  const { rows: outletRows } = await db.query('select id, nama from public.outlet order by id limit 1');
  const { rows: userRows } = await db.query('select id from auth.users where email = $1', [EMAIL]);
  const userId = userRows[0].id;
  const testLokasiId = lokasiRows[0].id;
  const testOutletId = outletRows[0].id;

  // 1. Accounting
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

  // 2. Pembangunan
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

  // 3. Resto
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

  const browser = await chromium.launch({ headless: true });

  // Capture Desktop Populated
  const contextDesktop = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const pageDesk = await contextDesktop.newPage();
  await pageDesk.goto(`${BASE_URL}/masuk`, { waitUntil: 'networkidle' });
  await pageDesk.fill('input[type="email"]', EMAIL);
  await pageDesk.fill('input[type="password"]', PASSWORD);
  await pageDesk.click('button[type="submit"]');
  await pageDesk.waitForURL(`${BASE_URL}/`);
  await pageDesk.waitForTimeout(2000);

  await pageDesk.evaluate(() => {
    document.querySelectorAll('nextjs-portal, [data-nextjs-toast], [data-nextjs-dev-overlay]').forEach(el => el.remove());
  });

  const deskPath = path.join(ARTIFACT_DIR, 'dashboard-desktop-1440-populated.png');
  await pageDesk.screenshot({ path: deskPath, fullPage: true });
  console.log('Saved populated desktop:', deskPath);
  await contextDesktop.close();

  // Capture Mobile Populated
  const contextMobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2,
  });
  const pageMob = await contextMobile.newPage();
  await pageMob.goto(`${BASE_URL}/masuk`, { waitUntil: 'networkidle' });
  await pageMob.fill('input[type="email"]', EMAIL);
  await pageMob.fill('input[type="password"]', PASSWORD);
  await pageMob.click('button[type="submit"]');
  await pageMob.waitForURL(`${BASE_URL}/`);
  await pageMob.waitForTimeout(2000);

  await pageMob.evaluate(() => {
    document.querySelectorAll('nextjs-portal, [data-nextjs-toast], [data-nextjs-dev-overlay]').forEach(el => el.remove());
  });

  const mobVpPath = path.join(ARTIFACT_DIR, 'dashboard-mobile-390-populated-viewport.png');
  await pageMob.screenshot({ path: mobVpPath, fullPage: false });
  console.log('Saved populated mobile viewport:', mobVpPath);

  const mobPath = path.join(ARTIFACT_DIR, 'dashboard-mobile-390-populated.png');
  await pageMob.screenshot({ path: mobPath, fullPage: true });
  console.log('Saved populated mobile fullPage:', mobPath);
  await contextMobile.close();

  await browser.close();
} finally {
  if (tempReportIds.length > 0) {
    await db.query('delete from public.report where id = any($1)', [tempReportIds]);
    console.log('Cleaned up temp reports successfully.');
  }
  await db.end();
}
