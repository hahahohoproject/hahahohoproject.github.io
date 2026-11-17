// 페이지별 기능: 메뉴, 첫 화면 버튼, 방명록, 계좌 복사, 영상.
import { expect, test } from './support/fixtures';

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
});

test('메뉴는 지금 보고 있는 페이지를 표시한다', async ({ page }) => {
  for (const [path, label] of [
    ['/', 'Home'],
    ['/wedding', 'Wedding'],
    ['/dowon', 'Dowon'],
  ]) {
    await page.goto(path);
    await expect(page.locator('header nav a[aria-current="page"]')).toHaveText(label);
  }
});

test('첫 화면의 버튼은 페이지 안에 실제로 있는 구역을 가리킨다', async ({ page }) => {
  for (const path of ['/', '/wedding', '/dowon']) {
    await page.goto(path);
    const target = await page.locator('.hero a.pill').getAttribute('href');
    expect(target, `${path}의 버튼`).toMatch(/^#\w+/);
    await expect(page.locator(target!)).toHaveCount(1);
  }
});

test('방명록: 일부만 먼저 보이고 버튼을 누르면 모두 펼쳐진다', async ({ page }) => {
  await page.goto('/wedding');
  const notes = page.locator('[data-guestbook] li.note');
  const more = page.locator('[data-guestbook] [data-more]');
  const total = await notes.count();
  expect(total, '방명록 글 수').toBeGreaterThan(0);

  const hidden = await page.locator('[data-guestbook] li.note[hidden]').count();
  test.skip(hidden === 0, '글이 적어 펼칠 것이 없다');

  await expect(more).toContainText(String(hidden));
  await more.click();
  await expect(page.locator('[data-guestbook] li.note[hidden]')).toHaveCount(0);
  await expect(notes.last()).toBeVisible();
  await expect(more).toHaveCount(0);
});

test('계좌 복사 버튼은 은행과 번호를 클립보드에 넣는다', async ({ page, context }) => {
  await page.goto('/wedding');
  const copy = page.locator('button[data-copy]').first();
  test.skip((await copy.count()) === 0, '계좌번호를 가리거나 끈 설정에서는 복사 버튼이 없다');

  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  const expected = await copy.getAttribute('data-copy');
  await copy.click();
  await expect(copy).toHaveText('복사됨');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(expected);
});

test('영상은 재생을 누르기 전에는 파일을 받지 않고, 포스터 이미지가 있다', async ({ page, request }) => {
  await page.goto('/wedding');
  const videos = await page.locator('#videos video').evaluateAll((elements) =>
    (elements as HTMLVideoElement[]).map((video) => ({
      preload: video.preload,
      poster: video.getAttribute('poster'),
      source: video.querySelector('source')?.getAttribute('src'),
    })),
  );
  expect(videos.length, '영상 수').toBeGreaterThan(0);

  for (const video of videos) {
    expect(video.preload).toBe('none');
    expect((await request.get(video.poster!)).status(), `포스터 ${video.poster}`).toBe(200);
    expect((await request.head(video.source!)).status(), `영상 ${video.source}`).toBe(200);
  }
});

test('인스타그램 릴스는 꼬리표 없는 임베드 주소로 들어간다', async ({ page }) => {
  await page.goto('/dowon');
  const sources = await page.locator('iframe[data-instagram-embed]').evaluateAll((frames) =>
    frames.map((frame) => frame.getAttribute('src')),
  );
  test.skip(sources.length === 0, '릴스가 없다');
  for (const source of sources) {
    expect(source).toMatch(/^https:\/\/www\.instagram\.com\/reel\/[\w-]+\/embed\/$/);
  }
});
