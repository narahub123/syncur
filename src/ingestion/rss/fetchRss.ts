import axios from "axios";

/**
 * RSS XML fetch layer
 *
 * === 역할 ===
 * RSS URL → raw XML string 획득
 *
 * === 특징 ===
 * - timeout 필수 (외부 서버 hang 방지)
 * - RSS 서버 차단 방지용 User-Agent 설정
 */
export async function fetchRSS(feedUrl: string): Promise<string> {
  const res = await axios.get(feedUrl, {
    timeout: 8000,
    headers: {
      "User-Agent": "Syncur RSS Bot",
      Accept: "application/rss+xml, application/xml, text/xml",
    },
  });

  return res.data;
}
