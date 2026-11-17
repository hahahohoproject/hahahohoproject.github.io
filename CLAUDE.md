# HahaHoho Project

우리 가족 웹사이트. 결혼식 청첩장과 도원이 첫 돌 예배 초대장에서 시작해 가족 포트폴리오로 키우는 중이다.
GitHub Pages(www.hahahohoproject.com)에 정적 사이트로 배포한다.

## 명령어

- `npm run dev` — 개발 서버
- `npm run check` — 타입 체크 (작업을 마치기 전에 반드시 통과)
- `npm run build` — `dist/`로 빌드 (작업을 마치기 전에 반드시 통과)
- `npm run preview` — 빌드 결과 확인. 백그라운드로 뜨며 `npx astro preview stop`으로 끈다
- `npm run export:guestbook` — 예전 방명록(GitHub Issues)을 `src/data/guestbook/`로 다시 내보내기

## 구조

- `src/pages/` — 페이지. `build.format: 'file'`이라 `wedding.astro`가 `/wedding.html`이 된다
- `src/layouts/`, `src/components/` — 초대장 페이지 공통 레이아웃과 구역 컴포넌트
- `src/scripts/` — 브라우저에서 도는 TypeScript. jQuery 없이 작성한다
- `src/assets/` — 빌드할 때 최적화되는 사진 원본
- `src/data/` — 페이지에 넣는 데이터(방명록, 연락처, 장소)
- `src/lib/` — 빌드할 때 도는 TypeScript(데이터 가공)
- `public/` — 그대로 복사되는 파일. 템플릿 CSS, 영상, 아직 옮기지 않은 예전 페이지가 여기 있다

## 지켜야 할 것

- `/wedding.html`, `/dowon.html` 주소는 이미 지인들에게 공유됐다. 바꾸거나 없애지 않는다
- `public/CNAME`은 건드리지 않는다
- 배포는 main에 push될 때 GitHub Actions가 한다. main에 직접 작업하지 말고 브랜치에서 작업한다
- 토큰·비밀번호 같은 비밀값을 브라우저로 가는 코드에 넣지 않는다. 정적 사이트라 숨길 곳이 없다
- 방명록은 읽기 전용 보관본이다. 쓰기 기능이 필요해지면 서버리스 함수 뒤에 둔다
- 전화번호·계좌번호는 페이지에 직접 쓰지 않고 `src/data/contacts/<행사>.json`에 모은다. 같은 파일의 `display`로 노출을 정한다: `phone`은 `show`/`hide`, `account`는 `show`/`mask`(끝 4자리만)/`hide`. 둘 다 `hide`면 구역 전체가 빠진다
- 집 주소처럼 민감한 장소 정보는 `src/data/places/<행사>.json`에 두고 `display.address`(`show`/`hide`)로 켜고 끈다. `hide`면 주소, 길 안내, 지도가 빠지고 장소 이름과 사진만 남는다
- 사진 갤러리는 `PhotoGallery` 컴포넌트를 쓴다. 라이트박스는 PhotoSwipe(MIT)이고, 다른 갤러리 스크립트를 섞어 쓰지 않는다
- 인스타그램 영상은 `InstagramReel` 컴포넌트에 릴스 id만 넘긴다. 공유 링크에 붙는 `?srtk=` 같은 꼬리표는 넣지 않는다
- 새 사진은 `public/`이 아니라 `src/assets/`에 넣고 `astro:assets`로 내보낸다. 긴 변이 3000px를 넘는 원본은 줄여서 커밋한다
- 화면에 보이는 글은 한국어, 코드 식별자는 영어로 쓴다

## 이전 현황

예전 사이트는 HTML5 UP 템플릿(Spectral, Lens)과 jQuery로 만들었다. 한 페이지씩 Astro로 옮기는 중이다.

- 옮김: 결혼식 페이지(`src/pages/wedding.astro`), 돌 예배 페이지(`src/pages/dowon.astro`). 스타일은 아직 `public/assets/css/main.css`를 그대로 쓴다
- 남음: `public/index.html`(dowon으로 넘기는 리다이렉트), `public/responsible.html`
- jQuery와 예전 스크립트는 지웠다. 남은 템플릿 자산은 `public/assets/`의 CSS, 웹폰트, Sass 원본이다
- 템플릿 CSS를 쓰는 동안은 푸터의 HTML5 UP 표기를 유지한다(CC BY 3.0 조건)

페이지를 옮길 때는 옮기기 전 화면과 모바일(390px)·데스크톱(1440px)에서 스크린샷을 비교해 확인한다.
