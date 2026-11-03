import { expect, test } from '@playwright/test';
import { allPages, crawl, defaultLocale, htmlLang, locales, localePath } from './support/site';

test.describe('三語 × 七頁都能開', () => {
  for (const { lang, path } of allPages) {
    test(`${path} 回 200，<html lang> 正確`, async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('lang', htmlLang[lang]);
      await expect(page.locator('h1')).toHaveCount(1);
    });
  }
});

test.describe('hreflang 與 canonical', () => {
  for (const { page: pagePath, path } of allPages) {
    test(`${path} 指向三語的同一頁`, async ({ page, baseURL }) => {
      await page.goto(path);
      const abs = (p: string) => new URL(p, baseURL).pathname;
      const alternates = await page.$$eval('link[rel="alternate"][hreflang]', (links) =>
        links.map((l) => ({ hreflang: l.getAttribute('hreflang'), href: l.getAttribute('href') ?? '' })),
      );
      const expected = [
        ...locales.map((l) => ({ hreflang: htmlLang[l], path: localePath(l, pagePath) })),
        { hreflang: 'x-default', path: localePath(defaultLocale, pagePath) },
      ];
      expect(alternates.map((a) => ({ hreflang: a.hreflang, path: abs(a.href) }))).toEqual(expected);
      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      // 只比對路徑：主機是網站 build 時設定的正式網址，對本機跑時會不同
      expect(abs(canonical ?? '')).toBe(path);
    });
  }
});

test('根路徑導向預設語言 /ja/', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/ja\/$/);
});

test('不存在的網址回 404', async ({ request }) => {
  const res = await request.get('/ja/this-page-does-not-exist/');
  expect(res.status()).toBe(404);
});

test('站內連結沒有 404', async ({ request }) => {
  const pages = await crawl(request);
  expect(pages.length).toBeGreaterThanOrEqual(allPages.length);
  for (const path of pages) {
    const res = await request.get(path);
    expect.soft(res.status(), path).toBe(200);
  }
});
