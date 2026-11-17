// 디자인 고르기: 사이트 기본값, 푸터 버튼, ?theme= 주소.
import { site } from '../src/config/site';
import { expect, readTheme, test, themeNames, themes } from './support/fixtures';

const [first, second] = themeNames.filter((name) => name !== site.theme);
const button = (name: keyof typeof themes) => `[data-theme-switcher] button[data-theme-option="${name}"]`;

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
});

test('고른 적이 없으면 사이트 기본 디자인이다', async ({ page }) => {
  await page.goto('/');
  expect(await readTheme(page)).toEqual({
    theme: site.theme,
    hero: themes[site.theme].hero,
    themeColor: themes[site.theme].themeColor,
    stored: null,
    pressed: site.theme,
  });
});

test('푸터 버튼에는 모든 디자인이 있다', async ({ page }) => {
  await page.goto('/');
  const labels = await page.locator('[data-theme-switcher] button').allInnerTexts();
  expect(labels).toEqual(themeNames.map((name) => themes[name].label));
});

test('버튼을 누르면 바로 바뀌고, 새로고침과 페이지 이동 뒤에도 유지된다', async ({ page }) => {
  await page.goto('/');
  await page.locator(button(first)).click();

  const expected = {
    theme: first,
    hero: themes[first].hero,
    themeColor: themes[first].themeColor,
    stored: first,
    pressed: first,
  };
  await expect.poll(() => readTheme(page)).toEqual(expected);

  await page.reload();
  expect(await readTheme(page)).toEqual(expected);

  await page.goto('/wedding');
  expect(await readTheme(page)).toEqual(expected);
});

test('기본 디자인을 다시 고르면 기억을 지운다', async ({ page }) => {
  await page.goto('/');
  await page.locator(button(second)).click();
  await expect.poll(async () => (await readTheme(page)).stored).toBe(second);

  await page.locator(button(site.theme)).click();
  await expect.poll(() => readTheme(page)).toMatchObject({ theme: site.theme, stored: null, pressed: site.theme });
});

test('키보드로도 고를 수 있다', async ({ page }) => {
  await page.goto('/');
  await page.locator(button(first)).focus();
  await page.keyboard.press('Enter');
  await expect.poll(() => readTheme(page)).toMatchObject({ theme: first, pressed: first });
});

test('?theme= 주소로 고르고 ?theme=default로 되돌린다', async ({ page }) => {
  await page.goto(`/dowon?theme=${first}`);
  expect(await readTheme(page)).toMatchObject({ theme: first, stored: first, pressed: first });

  // 없는 이름은 무시하고 앞서 고른 디자인을 유지한다
  await page.goto('/?theme=nonsense');
  expect(await readTheme(page)).toMatchObject({ theme: first, stored: first });

  await page.goto('/?theme=default');
  expect(await readTheme(page)).toMatchObject({ theme: site.theme, stored: null, pressed: site.theme });
});

test('한 사람의 선택은 다른 방문자에게 영향을 주지 않는다', async ({ page, browser }) => {
  await page.goto(`/?theme=${first}`);
  expect((await readTheme(page)).theme).toBe(first);

  const other = await browser.newContext();
  const otherPage = await other.newPage();
  await otherPage.goto(new URL('/', page.url()).href);
  expect((await readTheme(otherPage)).theme).toBe(site.theme);
  await other.close();
});
