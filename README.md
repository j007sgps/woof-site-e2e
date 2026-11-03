# woof-site-e2e

[![e2e](https://github.com/j007sgps/woof-site-e2e/actions/workflows/e2e.yml/badge.svg)](https://github.com/j007sgps/woof-site-e2e/actions/workflows/e2e.yml)
[![a11y](https://github.com/j007sgps/woof-site-e2e/actions/workflows/a11y.yml/badge.svg)](https://github.com/j007sgps/woof-site-e2e/actions/workflows/a11y.yml)
[![visual](https://github.com/j007sgps/woof-site-e2e/actions/workflows/visual.yml/badge.svg)](https://github.com/j007sgps/woof-site-e2e/actions/workflows/visual.yml)

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

## CI

| Workflow | 内容 | いつ走るか |
| --- | --- | --- |
| `e2e` | `a11y`・`visual` 以外のすべて | サイトのデプロイ後、毎日 JST 朝、push・PR |
| `a11y` | axe | 同上 |
| `visual` | スクリーンショット比較 | 同上。内容を変えると基準画像も変わるので、サイトのバッジには含めない |

サイトのデプロイが終わると、サイト側の workflow が `repository_dispatch`（`site-deployed`）を送ります。このリポジトリに secret はありません。

基準画像の更新：Actions → `visual` → Run workflow で `update` にチェック → `update-snapshots/<run id>` ブランチに push されるので PR を作る。

## 実行 / Running

```sh
npm install
npx playwright install chromium
npm test                                  # http://localhost:4321（サイト側で npm run build && npm run preview）
npm run test:e2e                          # a11y・visual 以外
BASE_URL=https://example.vercel.app npm test
```

スクリーンショットの基準画像は CI（GitHub Actions の ubuntu）で作ります。ローカルでは Chromium やフォントが違うので、`visual` は差分が出ることがあります。
