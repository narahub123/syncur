import axios from "axios";

/**
 * RSS HTTP Execution Layer
 *
 * === 역할 ===
 * - 실제 RSS 요청 수행
 * - timeout abort 처리
 * - retry / 정책 없음 (완전 순수 실행)
 */
export async function executeRSSRequest(params: {
  url: string;
  timeout: number;
  headers: Record<string, string>;
  signal?: AbortSignal;
}) {
  return axios.get(params.url, {
    signal: params.signal,
    timeout: params.timeout,
    headers: params.headers,
    validateStatus: (status) =>
      (status >= 200 && status < 300) || status === 304,
  });
}
