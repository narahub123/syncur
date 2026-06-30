import { htmlToText } from "html-to-text";
import { RSS_CONFIG } from "../rss-config";

/**
 * HTML content → feed description 변환
 *
 * === 역할 ===
 * RSS description/summary가 없는 경우
 * content 본문을 기반으로 preview 생성
 *
 * === 처리 ===
 * - HTML 제거
 * - 링크 URL 제거
 * - bullet(*) 제거
 * - 공백 정리
 * - 최대 길이 제한
 *
 * === 목적 ===
 * 피드 카드에서 사용할 짧은 요약 텍스트 생성
 */
export function createDescriptionFromContent(content: string | null): string {
  if (!content) return "";

  const text = htmlToText(content, {
    wordwrap: false,
    selectors: [{ selector: "a", options: { ignoreHref: true } }],
  })
    .replace(/\s*\*\s*/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return text.slice(0, RSS_CONFIG.DESCRIPTION_MAX_LENGTH);
}
