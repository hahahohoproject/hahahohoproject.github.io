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
```

main 브랜치에 push하면 GitHub Actions가 빌드해서 GitHub Pages로 배포합니다.
구조와 작업 규칙은 [CLAUDE.md](./CLAUDE.md)에 있습니다.

## 쓰는 것

- 사진 라이트박스: [PhotoSwipe](https://photoswipe.com) (MIT)
- 글꼴: Instrument Serif, 고운바탕, Pretendard (모두 OFL)
