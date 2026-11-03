import { defineConfig, devices } from '@playwright/test';

// BASE_URL 沒設定時對本機跑（網站 repo 的 `npm run build && npm run preview`）；CI 會設成正式網址。
const baseURL = process.env.BASE_URL ?? 'http://localhost:4321';

// 本機的 Chromium 版本和 @playwright/test 不同時，用這個指定執行檔。CI 不需要。
const executablePath = process.env.PW_CHROMIUM_EXECUTABLE;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  expect: {
    // 截圖比對：只容許反鋸齒等極小的差異。比例（maxDiffPixelRatio）在整頁截圖上太寬鬆，
    // 改一個數字（約 600 px）也不會失敗，所以用像素數。基準圖要在 CI 的環境產生（見 README）。
    toHaveScreenshot: { maxDiffPixels: 100, animations: 'disabled' },
  },
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    ...(executablePath && { launchOptions: { executablePath } }),
  },
  projects: [
    {
      name: 'desktop',
      testIgnore: /mobile\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } },
    },
    {
      name: 'mobile',
      testMatch: /mobile\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 390, height: 844 }, hasTouch: true },
    },
  ],
});
