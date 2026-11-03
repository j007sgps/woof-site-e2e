// mobile 專案（390px）才跑這個檔案，見 playwright.config.ts。
import { expect, test } from '@playwright/test';
import { crawl, locales, localePath } from './support/site';

test('390px 寬：所有頁面都沒有橫向捲動', async ({ page, request }) => {
  test.setTimeout(180_000);
  for (const path of await crawl(request)) {
    await page.goto(path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect.soft(overflow, path).toBeLessThanOrEqual(0);
  }
});

for (const lang of locales) {
  test(`390px 寬：${lang} 的導覽可以用`, async ({ page }) => {
    await page.goto(localePath(lang));
    const links = page.getByRole('navigation', { name: /メインメニュー|主選單|Main/ }).getByRole('link');
    const count = await links.count();
    expect(count).toBe(6);
    for (let i = 0; i < count; i++) {
      const link = links.nth(i);
      await expect(link).toBeInViewport();
      const box = await link.boundingBox();
      expect(box?.height, await link.innerText()).toBeGreaterThanOrEqual(44);
    }
    await links.first().click();
    await expect(page).toHaveURL(new RegExp(`${localePath(lang, 'work/')}$`));
  });
}
