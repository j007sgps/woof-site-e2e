# woof-site-e2e

鄭文硯（WenYen Cheng，WOOF）個人網站的 Playwright 測試。公開 repo。網站原始碼在私有 repo，這裡只放測試，對「正式網址」跑，所以 badge 反映的是網站現況。

## 工作方式

- 這是公開 repo：下面的保密規則對測試程式碼、fixture、截圖、commit 訊息、Actions log 全部適用。
- 這個 repo 不需要任何 secret。不要加 secret，也不要把 token 寫進 workflow。
- `BASE_URL` 沒設定時對本機 dev server（`http://localhost:4321`）跑；CI 設成正式網址。
- 測試網站原始碼看不到的東西時，只靠網站對外公開的內容判斷，不要假設私有 repo 的檔案結構。
- 推之前跑 `npm run typecheck` 和 `npm test`。Node 24（見 `.nvmrc`）。

## 已定案的決策

已經拍板的事，實作時不用再問。

| 項目 | 決定 |
| --- | --- |
| 技術選型 | Astro（靜態輸出為主，互動部分用 island） |
| 語言 | 日・繁中・英三語，`/ja` `/zh` `/en`，預設日文 |
| 翻譯 | 本人寫繁中，Claude 翻日英，本人審 |
| 風格 | 音ゲー霓虹 × 測試報告的混搭，收斂版（不花俏） |
| Dark mode | 有，預設跟隨系統，可手動切換並記住 |
| 名字表記 | 本名為主（大標），WOOF 為 logo 與 handle |
| 日文讀音 | テイ ブンゲン |
| Repo | 網站原始碼私有；測試網站的 Playwright repo 公開；其他作品 repo 可公開 |
| 工作內容 | 工作方法可以公開寫（不放客戶名） |
| AI Lab 首發 | 01 原則篇、04 自動化案例、06 本站製作、指揮官 skill 篇 |
| 聯絡方式 | 要放，具體帳號另行提供 |
| 大頭照 | 用 LinkedIn 頭貼，到之前先用剪影佔位圖 |
| 部署平台 | Vercel（先用預設網址，網域之後再接） |

## 公開範圍與保密規則

工作方法可以寫，但客戶和內部資訊一律去識別化；不確定的就先不放。原始碼、測試、內容、commit 訊息都適用。

| 可以寫 | 不寫 |
| --- | --- |
| 方法論、流程設計、stage 定義、分工原則 | 客戶名、案件名、產品名 |
| 量化成果（16h→30min 等） | 客戶的 repo 結構、程式碼、ticket 內容 |
| 抽象化的案例（「某法律資訊 Web 服務」這種程度） | skill 本體的原始內容 |
| 使用的公開工具（Playwright、GitHub Actions、Claude Code） | 內部工具名、內部 URL、同事姓名 |
| 居住地寫到「Tokyo」為止 | 更細的地點、座標 |
