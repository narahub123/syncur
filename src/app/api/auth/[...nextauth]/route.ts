import { handlers } from "@/auth";

/**
 * NextAuth 인증 API Route Handler.
 *
 * OAuth 로그인, 콜백, 세션 조회 등
 * NextAuth 내부 인증 흐름을 처리한다.
 */
export const { GET, POST } = handlers;
