// 고를 수 있는 디자인 목록.
// 디자인 하나는 (1) 색·글꼴·모양 토큰을 담은 src/styles/themes/<이름>.css 와
// (2) 아래에 적는 배치 선택으로 이루어진다. HTML 뼈대는 모든 디자인이 같이 쓴다.
//
// 디자인을 추가하려면: themes/ 폴더에 CSS 파일을 하나 만들고, 아래에 같은 이름으로 한 줄을 더한다.

/** 첫 화면(Hero) 배치. Hero 컴포넌트가 이 값마다 스타일을 갖고 있다. */
export type HeroLayout =
  /** 넓은 화면에서는 글과 사진이 좌우로 나뉘고, 휴대폰에서는 둥근 사진 위에 글이 얹힌다. */
  | 'split'
  /** 사진이 화면 가장자리까지 붙는다. 넓은 화면에서는 사진이 왼쪽 절반을 채운다. */
  | 'flush'
  /** 제목, 아치 모양 사진, 날짜가 가운데로 모인다. */
  | 'arch';

interface ThemeDefinition {
  /** 사람이 읽는 이름. */
  label: string;
  /** 어떤 느낌인지 한 줄 설명. */
  description: string;
  hero: HeroLayout;
  /** 휴대폰 브라우저의 주소창 색. 이 디자인의 바탕색과 맞춘다. */
  themeColor: string;
}

export const themes = {
  editorial: {
    label: '에디토리얼',
    description: '따뜻한 종이색 바탕, 큰 세리프 제목, 둥근 카드',
    hero: 'split',
    themeColor: '#f7f3ec',
  },
  minimal: {
    label: '미니멀',
    description: '흰 바탕에 검은 글자, 굵은 고딕 대문자 제목, 각진 모서리',
    hero: 'flush',
    themeColor: '#ffffff',
  },
  night: {
    label: '나이트',
    description: '어두운 바탕, 기울인 세리프 제목, 아치 사진과 가운데 정렬',
    hero: 'arch',
    themeColor: '#141614',
  },
} as const satisfies Record<string, ThemeDefinition>;

export type ThemeName = keyof typeof themes;
