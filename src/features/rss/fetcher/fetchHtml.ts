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
      redirect: "follow", // 이거 수정함
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
        accept: "text/html,application/xhtml+xml",
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP_ERROR_${res.status}`);
    }

    const html = await res.text();

    return html;
  } finally {
    clearTimeout(timeout);
  }
}
