# woof-site-e2e

WenYen Cheng (WOOF) の個人サイトを、本番 URL に対して毎日テストする Playwright リポジトリです。サイトのソースコードは非公開で、ここにはテストだけを置いています。バッジが示すのはソースではなく、公開中のサイトの今の状態です。

Playwright tests that run against the live site of WenYen Cheng (WOOF). The site's source is private; this repo holds only the tests, so the badge reflects the site as it is served today.

```sh
npm install
npx playwright install chromium
npm test                                 # http://localhost:4321（dev server）
BASE_URL=https://example.vercel.app npm test
```
