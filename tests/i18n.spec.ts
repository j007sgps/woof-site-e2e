import { expect, test } from '@playwright/test';
import { allPages, htmlLang, locales, localePath } from './support/site';

test.describe('語言切換後停在同一頁的對應語言', () => {
  for (const { lang, page: pagePath, path } of allPages) {
    test(path, async ({ page }) => {
      await page.goto(path);
      const switcher = page.locator(`nav:has(a[hreflang="${htmlLang.en}"])`).first();
      for (const target of locales.filter((l) => l !== lang)) {
        await switcher.locator(`a[hreflang="${htmlLang[target]}"]`).click();
        await expect(page).toHaveURL(new RegExp(`${localePath(target, pagePath)}$`));
        await expect(page.locator('html')).toHaveAttribute('lang', htmlLang[target]);
        await page.goto(path);
      }
      await expect(switcher.locator('a[aria-current="true"]')).toHaveAttribute('hreflang', htmlLang[lang]);
    });
  }
});
