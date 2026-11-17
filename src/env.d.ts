// BaseLayout의 <head>에 있는 스크립트가 만들어 두는 전역 객체.
interface Window {
  siteTheme: {
    /** 지금 화면에 적용된 디자인 이름. */
    current(): string;
    /** 디자인을 바꾸고 이 브라우저에 기억한다. */
    set(name: string): void;
  };
}
