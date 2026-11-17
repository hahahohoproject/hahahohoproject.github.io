// 주소 규칙: 확장자 없는 주소가 대표 주소이고, 예전 .html 링크도 계속 열린다.
import { expect, test } from './support/fixtures';

const currentMenu = 'header nav a[aria-current="page"]';
const pathOf = (url: string) => {
  const { pathname, search, hash } = new URL(url);
  return pathname + search + hash;
};

test('확장자 없는 주소로 페이지가 열린다', async ({ page }) => {
  await page.goto('/wedding');
  await expect(page.locator(currentMenu)).toHaveText('Wedding');
});

test('예전 .html 링크는 열리고, 주소창만 새로고침 없이 정리된다', async ({ page }) => {
  let loads = 0;
  page.on('load', () => loads++);

  await page.goto('/wedding.html');
  await expect(page).toHaveURL('/wedding');
  await expect(page.locator(currentMenu)).toHaveText('Wedding');
  expect(loads, '페이지를 불러온 횟수').toBe(1);

  await page.reload();
  await expect(page).toHaveURL('/wedding');
  await expect(page.locator(currentMenu)).toHaveText('Wedding');
});

test('주소를 정리할 때 쿼리와 해시는 남긴다', async ({ page }) => {
  await page.goto('/dowon.html?from=kakao#photos');
  await expect.poll(() => pathOf(page.url())).toBe('/dowon?from=kakao#photos');
});

test('/index.html은 /가 된다', async ({ page }) => {
  await page.goto('/index.html');
  await expect(page).toHaveURL('/');
  await expect(page.locator(currentMenu)).toHaveText('Home');
});

test('메뉴와 홈 카드는 확장자 없는 주소로 간다', async ({ page }) => {
  await page.goto('/');
  await page.locator('header nav a', { hasText: 'Dowon' }).click();
  await expect(page).toHaveURL('/dowon');
  await expect(page.locator(currentMenu)).toHaveText('Dowon');

  await page.goto('/');
  await page.locator('a.moment').first().click();
  await expect(page).toHaveURL('/wedding');
});

test('사이트 안의 링크에는 .html이 없다', async ({ page }) => {
  for (const path of ['/', '/wedding', '/dowon', '/404']) {
    await page.goto(path);
    const links = await page.locator('a[href^="/"]').evaluateAll((anchors) => anchors.map((a) => a.getAttribute('href')));
    expect(links.filter((href) => href?.includes('.html')), `${path}의 링크`).toEqual([]);
  }
});

test('대표 주소(canonical, og:url)는 확장자 없이 나간다', async ({ page }) => {
  const site = 'https://www.hahahohoproject.com';
  for (const path of ['/', '/wedding', '/dowon']) {
    await page.goto(path);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', site + path);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', site + path);
  }
});

test('없는 주소는 404 페이지를 보여 준다', async ({ page }) => {
  const response = await page.goto('/nope');
  expect(response?.status()).toBe(404);
  await expect(page.locator('h1')).toHaveText(/Not\s+found\./i);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
  await expect(page.locator(currentMenu)).toHaveCount(0);

  const links = await page.locator('.not-found a.pill').evaluateAll((anchors) => anchors.map((a) => a.getAttribute('href')));
  expect(links).toEqual(['/', '/wedding', '/dowon']);
});

test('끝에 /가 붙은 주소는 /를 떼고 다시 찾아간다', async ({ page }) => {
  await page.goto('/wedding/');
  await expect(page).toHaveURL('/wedding');
  await expect(page.locator(currentMenu)).toHaveText('Wedding');
});

test('없는 주소 끝에 /가 붙어도 404에서 멈춘다', async ({ page }) => {
  await page.goto('/nope/');
  await expect(page).toHaveURL('/nope');
  await expect(page.locator('.not-found')).toBeVisible();
});
