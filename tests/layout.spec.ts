// 모든 디자인 × 모든 페이지 × 여러 화면 폭에서 화면이 깨지지 않는지 본다.
import { expect, pagePaths, scrollThrough, test, themeNames } from './support/fixtures';

const widths = [320, 390, 820, 1440];

for (const theme of themeNames) {
  test.describe(`${theme} 디자인`, () => {
    test.use({ theme });

    for (const path of pagePaths) {
      for (const width of widths) {
        test(`${path} — ${width}px`, async ({ page }) => {
          await page.setViewportSize({ width, height: 800 });

          const failedRequests: string[] = [];
          page.on('response', (response) => {
            if (response.status() >= 400) failedRequests.push(`${response.status()} ${new URL(response.url()).pathname}`);
          });

          await page.goto(path);
          await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
          await scrollThrough(page);

          const facts = await page.evaluate(() => ({
            overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
            brokenImages: [...document.images].filter((image) => image.complete && !image.naturalWidth).map((image) => image.src),
            headings: document.querySelectorAll('h1').length,
          }));

          expect(facts.overflow, '가로로 넘친 폭(px)').toBeLessThanOrEqual(0);
          expect(facts.brokenImages, '깨진 이미지').toEqual([]);
          expect(facts.headings, 'h1 개수').toBe(1);
          expect(failedRequests, '실패한 요청').toEqual([]);
        });
      }
    }
  });
}
