/**
 * 파일 경로 꼴의 주소를 사이트가 쓰는 깔끔한 주소로 바꾼다.
 * "/wedding.html" → "/wedding", "/index.html" → "/", "/wedding/" → "/wedding"
 */
export function cleanPath(pathname: string): string {
  return pathname.replace(/(\/index)?(\.html)?\/?$/, '') || '/';
}
