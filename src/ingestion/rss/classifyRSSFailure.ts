import axios from "axios";
import { RSSFailureType } from "./types";

export function classifyRSSFailure(err: unknown): RSSFailureType {
  // Axios 에러만 처리
  if (axios.isAxiosError(err)) {
    const code = err.code;
    const status = err.response?.status;

    // 1. timeout / network 계열 → TEMPORARY
    if (
      code === "ECONNRESET" ||
      code === "ETIMEDOUT" ||
      code === "EAI_AGAIN" ||
      code === "ENOTFOUND" ||
      code === "ERR_CANCELED"
    ) {
      return "TEMPORARY";
    }

    // 2. HTTP 5xx → TEMPORARY (서버 문제)
    if (status && status >= 500) {
      return "TEMPORARY";
    }

    // 3. 4xx → PERMANENT (잘못된 URL/리소스)
    if (status && status >= 400 && status < 500) {
      return "PERMANENT";
    }
  }

  // 4. XML/parse 계열 (fetch 성공 후 처리 단계에서 발생)
  if (err instanceof Error) {
    const msg = err.message.toLowerCase();

    if (
      msg.includes("xml") ||
      msg.includes("parse") ||
      msg.includes("invalid")
    ) {
      return "PARSE";
    }
  }

  // fallback
  return "TEMPORARY";
}
