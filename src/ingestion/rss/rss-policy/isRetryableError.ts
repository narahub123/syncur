import axios from "axios";

/**
 * retry 가능한지 판단 (Policy Layer)
 */
export function isRetryableError(err: unknown): boolean {
  if (!axios.isAxiosError(err)) return true;

  const code = err.code;
  const status = err.response?.status;

  // 네트워크 계열 에러
  if (code) {
    const retryable = ["ECONNRESET", "ETIMEDOUT", "ERR_CANCELED", "EAI_AGAIN"];
    if (retryable.includes(code)) return true;
  }

  // 5xx 서버 에러
  if (status && status >= 500) return true;

  return false;
}

/**
 * backoff sleep
 */
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
