# HahaHoho Project

우리 가족 웹사이트. 가족 홈과, 결혼식 청첩장·도원이 첫 돌 예배 초대장 페이지로 이루어져 있다.
GitHub Pages(www.hahahohoproject.com)에 정적 사이트로 배포한다.

## 명령어

- `npm run dev` — 개발 서버. 백그라운드로 뜨며 `npx astro dev stop`으로 끈다
- `npm run check` — 타입 체크 (작업을 마치기 전에 반드시 통과)
- `npm run build` — `dist/`로 빌드 (작업을 마치기 전에 반드시 통과)
- `npm run preview` — 빌드 결과 확인. 백그라운드로 뜨며 `npx astro preview stop`으로 끈다
- `npm run export:guestbook` — 예전 방명록(GitHub Issues)을 `src/data/guestbook/`로 다시 내보내기

## 구조

- `src/pages/` — 페이지. `wedding.astro`가 `/wedding` 주소가 된다. `404.astro`는 없는 주소로 들어왔을 때 보이는 페이지다
- `src/layouts/BaseLayout.astro` — 모든 페이지의 뼈대(메타 정보, 글꼴, 헤더, 푸터)
- `src/components/` — 구역 컴포넌트. 페이지는 `Hero`와 `Section`을 쌓아서 만든다
- `src/styles/global.css` — 디자인 토큰(색, 글꼴, 크기, 간격)과 공통 스타일
- `src/assets/` — 빌드할 때 최적화되는 사진 원본
- `src/data/` — 페이지에 넣는 데이터(방명록, 연락처, 장소)
- `src/lib/` — 빌드할 때 도는 TypeScript(데이터 가공)
- `public/` — 그대로 복사되는 파일(영상, 공유 미리보기 이미지, CNAME)

## 디자인

큰 세리프 제목, 넉넉한 여백, 사진 중심의 "에디토리얼 앨범" 스타일이다.

- 색·글꼴·크기·간격은 `global.css`의 토큰(`var(--paper)`, `var(--text-xl)` 등)만 쓴다. 컴포넌트에 색상 값이나 px 글자 크기를 직접 쓰지 않는다
- 강조색은 페이지마다 다르다. `BaseLayout`의 `accent` 속성으로 넘기고, 컴포넌트는 `var(--accent)`로 받는다
- 글꼴: 영문 제목 Instrument Serif, 한글 제목·인용 고운바탕, 본문 Pretendard. 모두 npm 패키지로 직접 서빙한다
- 구역 제목은 영문에 마침표("Place."), 그 위 작은 라벨은 한글("오시는 길")로 쓴다
- 스타일은 컴포넌트의 `<style>`에 쓴다(자동으로 그 컴포넌트에만 적용). 슬롯이나 `<Image>`로 들어온 요소는 `:global()`로 잡는다
- 휴대폰이 기준이다. 넓은 화면용 배치는 `min-width` 미디어 쿼리로 더한다
- 등장 효과는 요소에 `reveal` 클래스를 붙인다. 새 애니메이션을 넣을 때는 `prefers-reduced-motion`을 지킨다
- 화면을 고친 뒤에는 320px, 390px, 1440px에서 가로 넘침이 없는지 스크린샷으로 확인한다

## 지켜야 할 것

- 주소는 확장자 없이 쓴다(`/wedding`, `/dowon`). 링크, 대표 주소(canonical), 공유용 주소 모두 마찬가지다. 경로를 다룰 때는 `src/lib/paths.ts`의 `cleanPath`를 쓴다
- `build.format: 'file'`은 바꾸지 않는다. `wedding.html` 파일로 내보내야 GitHub Pages가 `/wedding`과 예전에 공유된 `/wedding.html`을 둘 다 서빙한다. 같은 이유로 `wedding`, `dowon` 페이지 파일 이름도 바꾸지 않는다
- `public/CNAME`은 건드리지 않는다
- 배포는 main에 push될 때 GitHub Actions가 한다. main에 직접 작업하지 말고 브랜치에서 작업한다
- 토큰·비밀번호 같은 비밀값을 브라우저로 가는 코드에 넣지 않는다. 정적 사이트라 숨길 곳이 없다
- 방명록은 읽기 전용 보관본이다. 쓰기 기능이 필요해지면 서버리스 함수 뒤에 둔다
- 전화번호·계좌번호는 페이지에 직접 쓰지 않고 `src/data/contacts/<행사>.json`에 모은다. 같은 파일의 `display`로 노출을 정한다: `phone`은 `show`/`hide`, `account`는 `show`/`mask`(끝 4자리만)/`hide`. 둘 다 `hide`면 구역 전체가 빠진다
- 집 주소처럼 민감한 장소 정보는 `src/data/places/<행사>.json`에 두고 `display.address`(`show`/`hide`)로 켜고 끈다. `hide`면 주소, 길 안내, 지도가 빠지고 장소 이름과 사진만 남는다
- 가족에 관한 사실(이름, 날짜, 사연)은 지어내지 않는다. 모르는 내용은 비워 두고 물어본다
- 사진 갤러리는 `PhotoGallery` 컴포넌트를 쓴다. 라이트박스는 PhotoSwipe(MIT)이고, 다른 갤러리 스크립트를 섞어 쓰지 않는다
- 인스타그램 영상은 `InstagramReel` 컴포넌트에 릴스 id만 넘긴다. 공유 링크에 붙는 `?srtk=` 같은 꼬리표는 넣지 않는다
- 새 사진은 `public/`이 아니라 `src/assets/`에 넣고 `astro:assets`로 내보낸다. 긴 변이 3000px를 넘는 원본은 줄여서 커밋한다
- 화면에 보이는 글은 한국어, 코드 식별자는 영어로 쓴다
- 브라우저용 스크립트는 컴포넌트의 `<script>`에 TypeScript로 쓴다. jQuery 같은 범용 라이브러리는 넣지 않는다

## 남아 있는 예전 파일

예전 사이트는 HTML5 UP 템플릿과 jQuery로 만들었고, 지금은 모두 걷어 냈다. 아래만 남아 있다.

- `public/responsible.html` — 예전 반응형 시안을 모아 둔 페이지. 어디서도 연결하지 않는다
- `public/images/`의 `banner*.jpg`, `pic0*.jpg`, `photos13*.jpg`, `icon_*.png`, `fulls/`, `thumbs/` — 쓰지 않는 이미지
- `LICENSE.txt`, `README.txt` — 예전 템플릿의 라이선스와 설명서
