import { chromium } from 'playwright';
import path from 'node:path';

const ARTIFACT_DIR = 'C:\\Users\\USER\\.gemini\\antigravity-ide\\brain\\319f1e55-114d-47b9-b1fc-88b9378d5e20';
const BASE_URL = 'http://localhost:3000';
const EMAIL = 'uji-ceo@koperumnas.local';
const PASSWORD = 'Uji-CEO-Password-2026!';

const viewports = [
  { name: 'desktop-1440', width: 1440, height: 900, isMobile: false },
  { name: 'desktop-1920', width: 1920, height: 1080, isMobile: false },
  { name: 'tablet-768', width: 768, height: 1024, isMobile: false },
  { name: 'mobile-390', width: 390, height: 844, isMobile: true },
];

async function capture() {
  const browser = await chromium.launch({ headless: true });

  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      isMobile: vp.isMobile,
      hasTouch: vp.isMobile,
      deviceScaleFactor: 2,
      serviceWorkers: 'block', // Bypass service worker cache
    });

    const page = await context.newPage();
    console.log(`[Fresh Capture] ${vp.name} (${vp.width}x${vp.height})...`);

    // 1. Sign In
    await page.goto(`${BASE_URL}/masuk`, { waitUntil: 'networkidle' });
    await page.locator('input[type="email"]').fill(EMAIL);
    await page.locator('input[type="password"]').fill(PASSWORD);
    await page.getByRole('button', { name: 'Masuk' }).click();

    // 2. Wait for navigation to /
    await page.waitForURL(`${BASE_URL}/`, { timeout: 15000 });
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(2000); // UI stabilization

    // 3. Pastikan tidak ada elemen dev tools / floating indicator
    await page.evaluate(() => {
      document.querySelectorAll('nextjs-portal, [data-nextjs-toast], [data-nextjs-dev-overlay]').forEach(el => el.remove());
    });

    // 4. Take screenshots
    const outputPath = path.join(ARTIFACT_DIR, `dashboard-${vp.name}.png`);
    await page.screenshot({ path: outputPath, fullPage: true });
    console.log(`Saved: ${outputPath}`);

    if (vp.isMobile) {
      const viewportPath = path.join(ARTIFACT_DIR, `dashboard-${vp.name}-viewport.png`);
      await page.screenshot({ path: viewportPath, fullPage: false });
      console.log(`Saved: ${viewportPath}`);
    }

    if (vp.name === 'desktop-1440') {
      const lainnyaBtn = page.locator('button:has-text("Lainnya"), button:has-text("Menu:")').first();
      if (await lainnyaBtn.count() > 0) {
        await lainnyaBtn.click();
        await page.waitForTimeout(300);
        const menuPath = path.join(ARTIFACT_DIR, `dashboard-desktop-1440-menu-lainnya.png`);
        await page.screenshot({ path: menuPath, fullPage: false });
        console.log(`Saved: ${menuPath}`);
      }
    }

    await context.close();
  }

  await browser.close();
  console.log('Fresh capture completed successfully!');
}

capture().catch((e) => {
  console.error('Capture error:', e);
  process.exit(1);
});
