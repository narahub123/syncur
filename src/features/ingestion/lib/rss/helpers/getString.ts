/**
 * 안전한 string 변환 helper
 *
 * === 이유 ===
 * XML parser 결과는 string이 아닐 수도 있음 (object/array 혼재)
 */
export function getString(value: unknown): string | undefined {
  if (typeof value === "string") return value;
  return undefined;
}
