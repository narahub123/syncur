/**
 * .env 파일에서 서버 기본 URL을 가져옵니다.
 * 안전장치(Fallback)로 환경변수가 없을 때만 로컬 주소를 바라보게 만듭니다.
 */
const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

export const API_ROUTES = {
  SSE: {
    ADMIN: `${BASE_URL}/api/sse/admin`,
    USER: `${BASE_URL}/api/sse/user`,
  },
} as const;

export type ApiRoutes = typeof API_ROUTES;
