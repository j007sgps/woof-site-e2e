// 首頁與 AI Lab 首頁的截圖比對。內容改了之後基準圖要更新：在 Actions 執行 visual workflow 並勾選 update，
// 新的基準圖會推到 update-snapshots/* 分支，開 PR review。頁尾的 CI badge 會隨狀態改變，所以遮起來。
import { expect, test } from '@playwright/test';

const targets = [
  { name: 'home', path: '/ja/' },
  { name: 'ai-lab', path: '/ja/ai-lab/' },
];

for (const colorScheme of ['dark', 'light'] as const) {
  for (const { name, path } of targets) {
    test(`${name}（${colorScheme}）`, { tag: '@visual' }, async ({ browser }) => {
      const page = await browser.newPage({ colorScheme, viewport: { width: 1280, height: 800 } });
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      await expect(page).toHaveScreenshot(`${name}-${colorScheme}.png`, {
        fullPage: true,
        mask: [page.locator('footer img')],
      });
      await page.close();
    });
  }
}
