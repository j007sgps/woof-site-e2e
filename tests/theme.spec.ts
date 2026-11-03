import { expect, test, type Page } from '@playwright/test';

/** 背景的亮度（0＝黑、1＝白）。不看色碼，只看是深是淺，配色改了也不用改測試。 */
async function backgroundLuminance(page: Page): Promise<number> {
  return page.evaluate(() => {
    const [r = 0, g = 0, b = 0] = getComputedStyle(document.body).backgroundColor.match(/\d+/g)!.map(Number);
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  });
}

const toggle = (page: Page) => page.getByRole('button', { name: /テーマ|主題|Theme/ });

test.describe('預設跟隨系統', () => {
  test('系統是深色 → 深色', async ({ browser }) => {
    const page = await browser.newPage({ colorScheme: 'dark' });
    await page.goto('/ja/');
    expect(await backgroundLuminance(page)).toBeLessThan(0.2);
    await page.close();
  });

  test('系統是淺色 → 淺色', async ({ browser }) => {
    const page = await browser.newPage({ colorScheme: 'light' });
    await page.goto('/ja/');
    expect(await backgroundLuminance(page)).toBeGreaterThan(0.8);
    await page.close();
  });

  test('還沒手動選過時，系統切換也跟著切', async ({ browser }) => {
    const page = await browser.newPage({ colorScheme: 'light' });
    await page.goto('/ja/');
    await page.emulateMedia({ colorScheme: 'dark' });
    await expect.poll(() => backgroundLuminance(page)).toBeLessThan(0.2);
    await page.close();
  });
});

test.describe('手動切換', () => {
  test.use({ colorScheme: 'dark' });

  test('切換有效，重新整理和換頁後都保留', async ({ page }) => {
    await page.goto('/en/work/');
    await toggle(page).click();
    await expect.poll(() => backgroundLuminance(page)).toBeGreaterThan(0.8);

    await page.reload();
    expect(await backgroundLuminance(page)).toBeGreaterThan(0.8);

    await page.goto('/zh/');
    expect(await backgroundLuminance(page)).toBeGreaterThan(0.8);

    await toggle(page).click();
    await expect.poll(() => backgroundLuminance(page)).toBeLessThan(0.2);
    await page.reload();
    expect(await backgroundLuminance(page)).toBeLessThan(0.2);
  });

  test('手動選過之後，系統切換不會蓋掉選擇', async ({ page }) => {
    await page.goto('/ja/');
    await toggle(page).click();
    await page.emulateMedia({ colorScheme: 'light' });
    await page.emulateMedia({ colorScheme: 'dark' });
    expect(await backgroundLuminance(page)).toBeGreaterThan(0.8);
  });

  test('不會閃白：選了淺色後，頁面一開始就是淺色', async ({ page }) => {
    await page.goto('/ja/');
    await toggle(page).click();
    // DOMContentLoaded 的時候（樣式已套用、還沒跑任何 module script）就已經是選好的主題
    await page.addInitScript(() => {
      document.addEventListener('DOMContentLoaded', () => {
        const [r = 0, g = 0, b = 0] = getComputedStyle(document.body).backgroundColor.match(/\d+/g)!.map(Number);
        (window as unknown as { __lumAtDcl: number }).__lumAtDcl = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
      });
    });
    await page.goto('/ja/ai-lab/');
    const lum = await page.evaluate(() => (window as unknown as { __lumAtDcl: number }).__lumAtDcl);
    expect(lum).toBeGreaterThan(0.8);
  });
});
