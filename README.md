# HahaHoho Project

우리 가족 웹사이트입니다. 결혼식 청첩장과 도원이 첫 돌 예배 초대장에서 시작해 가족 홈으로 넓혔습니다.

- 가족 홈: [www.hahahohoproject.com](https://www.hahahohoproject.com)
- 결혼식 청첩장: [/wedding](https://www.hahahohoproject.com/wedding)
- 도원이 첫 돌 예배: [/dowon](https://www.hahahohoproject.com/dowon)

## 개발

[Astro](https://astro.build)로 만든 정적 사이트이고, Node.js 22.23.4 이상이 필요합니다.

```sh
npm install
npm run dev      # 개발 서버
npm run check    # 타입 체크
npm run build    # dist/ 로 빌드
npm test         # 빌드한 뒤 브라우저 테스트 (처음 한 번: npx playwright install chromium)
```

main 브랜치에 push하면 GitHub Actions가 빌드와 테스트를 거쳐 GitHub Pages로 배포합니다.
구조와 작업 규칙은 [CLAUDE.md](./CLAUDE.md)에 있습니다.

## 디자인 바꾸기

디자인은 세 가지(`editorial`, `minimal`, `night`)가 있고, 사이트의 기본 디자인은 [src/config/site.ts](./src/config/site.ts)의 `theme` 한 줄로 정합니다.
방문자는 푸터의 디자인 버튼이나 주소 뒤의 `?theme=night`로 자기 브라우저에서만 다른 디자인을 고를 수 있고, `?theme=default`로 되돌립니다.

## 쓰는 것

- 사진 라이트박스: [PhotoSwipe](https://photoswipe.com) (MIT)
- 글꼴: Instrument Serif, 고운바탕, Pretendard (모두 OFL)
