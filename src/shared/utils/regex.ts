/**
 * 정규식에서 특수문자로 해석될 수 있는 문자를 이스케이프 처리하는 함수
 *
 * DB 검색 시 사용자 입력 문자열을 정규식 패턴으로 사용할 경우,
 * 의도치 않은 정규식 동작(패턴 해석)을 방지하기 위해 사용한다.
 *
 * 예:
 * "a.b" → "a\.b"
 * "site?test" → "site\?test"
 *
 * @param value - 정규식 이스케이프 처리할 원본 문자열
 * @returns 안전하게 escape된 문자열
 */
export function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
