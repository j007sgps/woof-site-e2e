// 數字表的值要和網站公開的 /metrics.json 一致（防止改了一邊忘了另一邊）。
import { expect, test, type Page } from '@playwright/test';
import { locales, localePath, type Locale } from './support/site';

interface Metric {
  id: string;
  before: string | null;
  after: Record<Locale, string>;
  status: 'PASS' | 'RUNNING';
  home: boolean;
}

/** 表頭是 metric / before / after / status 的表格，每列的 before、after、status。 */
async function readMetricTable(page: Page) {
  const table = page.locator('table', { has: page.locator('thead', { hasText: 'metric' }) });
  await expect(table).toHaveCount(1);
  await expect(table.locator('thead th')).toHaveText(['metric', 'before', 'after', 'status']);
  return table.locator('tbody tr').evaluateAll((rows) =>
    rows.map((row) => {
      const cells = [...row.querySelectorAll('th, td')].map((c) => c.textContent?.trim() ?? '');
      return { before: cells[1], after: cells[2], status: cells[3] };
    }),
  );
}

let metrics: Metric[];

test.beforeAll(async ({ request }) => {
  const res = await request.get('/metrics.json');
  expect(res.ok()).toBe(true);
  metrics = await res.json();
  expect(metrics.length).toBeGreaterThan(0);
});

for (const lang of locales) {
  for (const [page, filter] of [['', (m: Metric) => m.home], ['work/', () => true]] as const) {
    test(`${localePath(lang, page)} 的數字表和 /metrics.json 一致`, async ({ page: browserPage }) => {
      await browserPage.goto(localePath(lang, page));
      const rows = await readMetricTable(browserPage);
      const expected = metrics.filter(filter).map((m) => ({ before: m.before ?? '—', after: m.after[lang], status: m.status }));
      expect(rows).toEqual(expected);
    });
  }
}

test('status 只有 PASS 與 RUNNING', () => {
  for (const m of metrics) expect(['PASS', 'RUNNING']).toContain(m.status);
});
