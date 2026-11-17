// 데이터 파일(src/data/**)의 display 설정 값을 검사한다.
// JSON에서는 값이 그냥 문자열로 읽히므로, 오타가 있으면 빌드를 멈춰 잘못된 상태로 배포되지 않게 한다.

export function parseDisplayMode<T extends string>(
  source: string,
  field: string,
  value: string,
  allowed: readonly T[],
): T {
  if ((allowed as readonly string[]).includes(value)) return value as T;
  throw new Error(`${source} 설정 display.${field} 값이 "${value}"입니다. ${allowed.join(', ')} 중 하나여야 합니다.`);
}
