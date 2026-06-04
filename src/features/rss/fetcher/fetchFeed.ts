import { parseStringPromise } from "xml2js";

/**
 * RSS endpoint 검증용 fetch
 *
 * 역할:
 * - URL이 RSS인지 확인
 * - XML parse 성공 여부 체크
 */
export async function fetchFeed(url: string): Promise<boolean> {
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, 4000);

  try {
    const res = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      headers: {
        accept: "application/rss+xml, application/xml, text/xml",
      },
    });

    if (!res.ok) return false;

    const text = await res.text();

    /**
     * 1차 validation:
     * - XML parse 가능 여부
     */
    await parseStringPromise(text);

    return true;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}
