// 사진 격자와 라이트박스.
import { expect, test } from './support/fixtures';

const galleries = [
  { name: '결혼식', path: '/wedding' },
  { name: '돌 예배', path: '/dowon' },
  { name: '홈 사진첩', path: '/' },
];

const thumbnails = '[data-photo-gallery] a';

for (const { name, path } of galleries) {
  test.describe(name, () => {
    for (const width of [390, 1440]) {
      test(`격자: 한 줄의 높이가 같고 사진이 잘리지 않는다 — ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 844 });
        await page.goto(path);
        await page.locator(thumbnails).first().scrollIntoViewIfNeeded();

        const grid = await page.locator(thumbnails).evaluateAll((links) => {
          const rows = new Map<number, number[]>();
          let worstCrop = 0;
          for (const link of links as HTMLElement[]) {
            const box = link.getBoundingClientRect();
            const top = Math.round(box.top);
            rows.set(top, [...(rows.get(top) ?? []), box.height]);
            const ratio = Number(link.style.getPropertyValue('--ratio'));
            worstCrop = Math.max(worstCrop, Math.abs(box.width / box.height - ratio) / ratio);
          }
          return {
            count: links.length,
            unevenRows: [...rows.values()].filter((heights) => Math.max(...heights) - Math.min(...heights) > 1).length,
            worstCrop,
          };
        });

        expect(grid.count, '사진 수').toBeGreaterThan(0);
        expect(grid.unevenRows, '높이가 어긋난 줄 수').toBe(0);
        expect(grid.worstCrop, '사진 비율이 어긋난 정도').toBeLessThan(0.02);
      });
    }

    test('라이트박스: 열기, 다음 사진, 뒤로 가기와 Esc로 닫기', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(path);
      const lightbox = page.locator('.pswp');
      const counter = page.locator('.pswp__counter');
      const open = async (index: number) => {
        await page.locator(thumbnails).nth(index).scrollIntoViewIfNeeded();
        await page.locator(thumbnails).nth(index).click();
        await expect(lightbox).toHaveClass(/pswp--open/);
        await expect(lightbox).toHaveClass(/pswp--ui-visible/);
      };

      await open(1);
      await expect(counter).toHaveText(/^2 \/ \d+$/);

      await page.keyboard.press('ArrowRight');
      await expect(counter).toHaveText(/^3 \/ \d+$/);

      // 휴대폰의 뒤로 가기: 라이트박스만 닫히고 페이지는 남는다
      await page.goBack();
      await expect(lightbox).toHaveCount(0);
      await expect(page).toHaveURL(path);

      // Esc로 닫으면 여는 동안 쌓아 둔 방문 기록도 함께 정리된다
      await open(0);
      await page.keyboard.press('Escape');
      await expect(lightbox).toHaveCount(0);
      await expect.poll(() => page.evaluate(() => history.state?.photoGallery ?? false)).toBe(false);
      await expect(page).toHaveURL(path);
    });
  });
}
