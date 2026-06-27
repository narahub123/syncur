import { normalizeError } from "@/features/ingestion/logger/normalizeError";
import { Logger } from "@/features/ingestion/logger/types";
import * as cheerio from "cheerio";
import { FetchContentResult } from "./types";

/**
 * HTML을 요청하여 Cheerio DOM 객체를 생성합니다.
 *
 * @param {string} url - 요청할 페이지 URL
 * @param {Record<string, string>} headers - HTTP 요청 헤더
 * @param {Logger} logger - ingestion logger
 * @returns {Promise<FetchContentResult | null>} DOM 생성 결과를 반환하며, 실패 시 null을 반환합니다.
 */
export async function fetchContent(
  url: string,
  headers: Record<string, string>,
  logger: Logger,
): Promise<FetchContentResult | null> {
  try {
    // 페이지를 요청하여 HTML을 가져옵니다.
    const res = await fetch(url, {
      headers,
      signal: AbortSignal.timeout(6000),
    });

    // 정상 응답이 아니면 실패로 처리합니다.
    if (!res.ok) {
      logger.warn("페이지 조회 실패", {
        url,
        status: res.status,
      });

      return null;
    }

    // HTML을 읽어 Cheerio DOM 객체를 생성합니다.
    const html = await res.text();
    const dom = cheerio.load(html);

    logger.debug("페이지 조회", {
      url,
      status: res.status,
    });

    return {
      dom,
    };
  } catch (error: unknown) {
    // 네트워크 오류 또는 timeout 발생 시 null을 반환합니다.
    logger.warn("페이지 요청 실패", {
      url,
      error: normalizeError(error),
    });

    return null;
  }
}
