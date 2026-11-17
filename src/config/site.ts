// 사이트 설정.
import type { ThemeName } from './themes';

export const site: { theme: ThemeName } = {
  /**
   * 사이트 전체 디자인. 이 한 줄만 바꾸면 모든 페이지가 바뀐다.
   * 고를 수 있는 값: 'editorial' | 'minimal' | 'night' (목록과 설명은 ./themes.ts)
   *
   * 여기서 정하는 것은 기본값이다. 방문자는 푸터의 디자인 버튼이나 주소 뒤의 ?theme=night 로
   * 자기 브라우저에서만 다른 디자인을 고를 수 있고, ?theme=default 로 기본값으로 돌아온다.
   */
  theme: 'editorial',
};
