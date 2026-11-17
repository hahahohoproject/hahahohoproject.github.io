// 노출 설정(src/data/**의 display)이 배포되는 HTML에 그대로 지켜지는지 본다.
// 가리거나 끈 값이 실수로 페이지에 다시 들어가면 여기서 걸린다.
import { readFileSync } from 'node:fs';
import { maskNumber, type ContactData } from '../src/lib/contacts';
import type { PlaceData } from '../src/lib/place';
import { expect, test } from './support/fixtures';

const readJson = <T>(path: string): T => JSON.parse(readFileSync(path, 'utf8'));

const contactPages = [
  { path: '/wedding', file: 'src/data/contacts/wedding.json' },
  { path: '/dowon', file: 'src/data/contacts/dowon.json' },
];

for (const { path, file } of contactPages) {
  const contacts = readJson<ContactData>(file);

  test(`${path}: 전화번호 설정(${contacts.display.phone})을 지킨다`, async ({ request }) => {
    const html = await (await request.get(path)).text();
    for (const group of contacts.groups) {
      if (contacts.display.phone === 'show') expect(html).toContain(`tel:${group.phone}`);
      else expect(html, `${group.role} 전화번호`).not.toContain(group.phone);
    }
  });

  test(`${path}: 계좌번호 설정(${contacts.display.account})을 지킨다`, async ({ request }) => {
    const html = await (await request.get(path)).text();
    for (const account of contacts.groups.flatMap((group) => group.accounts)) {
      if (contacts.display.account === 'show') {
        expect(html).toContain(account.number);
        continue;
      }
      expect(html, `${account.holder} 계좌번호`).not.toContain(account.number);
      if (contacts.display.account === 'mask') expect(html).toContain(maskNumber(account.number));
      else expect(html, `${account.holder} 이름`).not.toContain(account.holder);
    }
  });
}

const place = readJson<PlaceData>('src/data/places/dowon.json');

test(`/dowon: 주소 설정(${place.display.address})을 지킨다`, async ({ request }) => {
  const html = await (await request.get('/dowon')).text();
  const { complex, unit, directions, map } = place.address;

  if (place.display.address === 'show') {
    expect(html).toContain(unit);
    return;
  }
  for (const secret of [complex, unit, ...directions.slice(1), String(map.lat), String(map.lng)]) {
    expect(html, `"${secret}"`).not.toContain(secret);
  }
  // 지도도 주소와 함께 꺼져야 한다. 좌표가 위치를 그대로 드러내기 때문이다.
  expect(html).not.toContain('data-naver-map');
});
