// 모든 테스트가 같이 쓰는 준비 코드.
import { expect, test as base, type Page } from '@playwright/test';
import { themes, type ThemeName } from '../../src/config/themes';

export const themeNames = Object.keys(themes) as ThemeName[];
export { expect, themes };

/** 점검 대상 페이지. /404는 없는 주소일 때 보이는 페이지를 직접 연 것이다. */
export const pagePaths = ['/', '/wedding', '/dowon', '/404'];

interface Options {
  /** 방문자가 이 디자인을 골라 둔 상태로 시작한다. 없으면 사이트 기본 디자인이다. */
  theme: ThemeName | undefined;
}

export const test = base.extend<Options>({
  theme: [undefined, { option: true }],

  page: async ({ page, theme }, use) => {
    // 바깥 서비스(지도, 인스타그램)는 막는다. 테스트가 네트워크 상태에 흔들리지 않게 하기 위해서다.
    await page.route(/openapi\.map\.naver\.com|instagram\.com/, (route) => route.abort());

    if (theme) {
      await page.addInitScript((name) => {
        // 맨 위 문서에만 적용한다. 막힌 iframe 안에서는 저장소 접근이 거부된다.
        if (window.top === window) localStorage.setItem('theme', name);
      }, theme);
    }

    const scriptErrors: string[] = [];
    page.on('pageerror', (error) => scriptErrors.push(`${new URL(page.url()).pathname}: ${error.message}`));

    await use(page);

    // 어떤 테스트든 페이지에서 스크립트 오류가 났다면 실패로 본다.
    expect(scriptErrors, '페이지 스크립트 오류').toEqual([]);
  },
});

/** 지연 로딩되는 이미지를 모두 불러오도록 페이지를 끝까지 훑는다. */
export async function scrollThrough(page: Page): Promise<void> {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 40));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForLoadState('networkidle');
}

/** 지금 적용된 디자인과, 방문자의 선택이 저장돼 있는지를 읽는다. */
export function readTheme(page: Page) {
  return page.evaluate(() => ({
    theme: document.documentElement.dataset.theme,
    hero: document.documentElement.dataset.hero,
    themeColor: document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.content,
    stored: localStorage.getItem('theme'),
    pressed: [...document.querySelectorAll<HTMLElement>('[data-theme-option][aria-pressed="true"]')]
      .map((button) => button.dataset.themeOption)
      .join(),
  }));
}
