import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { crawl } from './support/site';

const tags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

for (const colorScheme of ['dark', 'light'] as const) {
  test.describe(`${colorScheme} 主題`, () => {
    test.use({ colorScheme });

    test(`axe：所有頁面 0 violations`, async ({ page, request }) => {
      test.setTimeout(240_000);
      for (const path of await crawl(request)) {
        await page.goto(path);
        await page.evaluate(() => document.fonts.ready);
        const { violations } = await new AxeBuilder({ page }).withTags(tags).analyze();
        const summary = violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`);
        expect.soft(summary, `${path}（${colorScheme}）`).toEqual([]);
      }
    });
  });
}
