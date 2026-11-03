# woof-site-e2e

WenYen Cheng (WOOF) の個人サイトを、本番 URL に対して毎日テストする Playwright リポジトリです。サイトのソースコードは非公開で、ここにはテストだけを置いています。バッジが示すのはソースではなく、公開中のサイトの今の状態です。

Playwright tests that run against the live site of WenYen Cheng (WOOF). The site's source is private; this repo holds only the tests, so the badge reflects the site as it is served today.

## テスト内容 / What is tested

| ファイル | 内容 |
| --- | --- |
| `routing.spec.ts` | 3 言語 × 7 ページが 200 を返す、`hreflang` と canonical、`/` → `/ja/`、存在しない URL は 404、サイト内リンク切れなし |
| `i18n.spec.ts` | 言語を切り替えても同じページの対応する言語に移る |
| `theme.spec.ts` | 初期表示は OS の設定に従う、手動切り替えがリロード・ページ移動後も保たれる、白く光らない（FOUC なし） |
| `a11y.spec.ts` | 全ページ × ダーク／ライトで axe の違反 0 件 |
| `mobile.spec.ts` | 390px 幅で横スクロールなし、ナビゲーションが使える（タップ領域 44px 以上） |
| `metrics.spec.ts` | 数字の表がサイトの `/metrics.json` と一致する |
| `visual.spec.ts` | トップと AI Lab のスクリーンショット比較 |

ページ一覧はサイト内リンクをたどって集めるので、記事や作品のページが増えてもテストを書き足す必要はありません。

## 実行 / Running

```sh
npm install
npx playwright install chromium
npm test                                  # http://localhost:4321（サイト側で npm run build && npm run preview）
BASE_URL=https://example.vercel.app npm test
npm run test:update-snapshots             # スクリーンショットの基準画像を更新
```

スクリーンショットの基準画像は CI と同じ環境（GitHub Actions の ubuntu）で作ります。ローカルの Chromium のバージョンが違うと差分が出ることがあります。
