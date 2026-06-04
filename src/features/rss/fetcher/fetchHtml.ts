/**
 * HTML을 가져오는 fetcher
 *
 * 역할:
 * - RSS discovery의 시작점
 * - raw HTML만 반환 (파싱 X)
 */
export async function fetchHtml(url: string): Promise<string> {
  const controller = new AbortController();

  // 5초 timeout (RSS discovery는 느리면 안 됨)
  const timeout = setTimeout(() => {
    controller.abort();
  }, 5000);

  try {
    const res = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      headers: {
        "user-agent": "SyncurBot/1.0 (+https://syncur.app/bot)",
        accept: "text/html,application/xhtml+xml",
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP_ERROR_${res.status}`);
    }

    return await res.text();
  } finally {
    clearTimeout(timeout);
  }
}
