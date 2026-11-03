// 首頁與 AI Lab 首頁的截圖比對。內容改了的話，跑 `npm run test:update-snapshots` 更新基準圖，跟著內容一起 review。
import { expect, test } from '@playwright/test';

const targets = [
  { name: 'home', path: '/ja/' },
  { name: 'ai-lab', path: '/ja/ai-lab/' },
];

for (const colorScheme of ['dark', 'light'] as const) {
  for (const { name, path } of targets) {
    test(`${name}（${colorScheme}）`, async ({ browser }) => {
      const page = await browser.newPage({ colorScheme, viewport: { width: 1280, height: 800 } });
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      await expect(page).toHaveScreenshot(`${name}-${colorScheme}.png`, { fullPage: true });
      await page.close();
    });
  }
}
