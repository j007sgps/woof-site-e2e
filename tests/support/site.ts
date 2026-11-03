// 網站的公開規格：語言、七個頁面、hreflang 用的語言標籤。
// 這個 repo 看不到網站的原始碼，所以這裡寫的是「網站對外承諾的樣子」，不是從原始碼複製來的設定。
import type { APIRequestContext } from '@playwright/test';

export const locales = ['ja', 'zh', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'ja';

/** `<html lang>` 與 hreflang 的值。路徑是 /zh，語言標籤是 zh-Hant。 */
export const htmlLang: Record<Locale, string> = { ja: 'ja', zh: 'zh-Hant', en: 'en' };

/** 七個頁面（不含語言前綴）。空字串是首頁。 */
export const pages = ['', 'work/', 'ai-lab/', 'projects/', 'play/', 'about/', 'contact/'] as const;

export const localePath = (lang: Locale, page = '') => `/${lang}/${page}`;

/** 七頁 × 三語。 */
export const allPages = locales.flatMap((lang) => pages.map((page) => ({ lang, page, path: localePath(lang, page) })));

const isPagePath = (href: string) => /^\/(ja|zh|en)\/([^?#]*\/)?$/.test(href);

/**
 * 從三個語言的首頁開始，沿著站內連結找出所有頁面（作品、文章的詳細頁也會找到）。
 * 只看 HTML 裡的 <a href="/…/">，不需要瀏覽器。
 */
export async function crawl(request: APIRequestContext): Promise<string[]> {
  const seen = new Set<string>();
  const queue = locales.map((lang) => localePath(lang));
  while (queue.length > 0) {
    const path = queue.shift()!;
    if (seen.has(path)) continue;
    seen.add(path);
    const res = await request.get(path);
    if (!res.ok()) continue;
    const html = await res.text();
    for (const [, href] of html.matchAll(/<a\s[^>]*href="([^"]+)"/g)) {
      if (href && isPagePath(href) && !seen.has(href)) queue.push(href);
    }
  }
  return [...seen].sort();
}
