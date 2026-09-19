import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('http://localhost:3000/masuk');
await page.locator('input[type="email"]').fill('uji-ceo@koperumnas.local');
await page.locator('input[type="password"]').fill('Uji-CEO-Password-2026!');
await page.getByRole('button', { name: 'Masuk' }).click();
await page.waitForURL('http://localhost:3000/', { timeout: 10000 });
await page.waitForTimeout(2000);

const content = await page.content();
console.log('Contains OLD "Belum ada laporan Accounting hari ini":', content.includes('Belum ada laporan Accounting hari ini'));
console.log('Contains NEW "Laporan Keuangan Hari Ini Belum Tersedia":', content.includes('Laporan Keuangan Hari Ini Belum Tersedia'));
console.log('Contains NEW "Rekap Unit Pembangunan Hari Ini":', content.includes('Rekap Unit Pembangunan Hari Ini'));
console.log('Contains NEW "Silang-Cek Omzet Resto Hari Ini":', content.includes('Silang-Cek Omzet Resto Hari Ini'));
console.log('Contains NEW "Audit Silang":', content.includes('Audit Silang'));
console.log('Contains NEW "Menunggu Laporan Accounting":', content.includes('Menunggu Laporan Accounting'));

await browser.close();
