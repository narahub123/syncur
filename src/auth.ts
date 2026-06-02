import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";

import clientPromise from "@/shared/lib/db/mongodb";

/**
 * NextAuth v5 인증 설정.
 *
 * export 항목:
 * - handlers: 인증 API Route Handler에서 사용
 * - auth: 서버 컴포넌트에서 현재 세션 조회
 * - signIn: Server Action에서 로그인 실행
 * - signOut: Server Action에서 로그아웃 실행
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  /**
   * 인증 관련 데이터를 MongoDB에 저장한다.
   *
   * 저장 대상:
   * - User
   * - Account
   * - Session
   * - VerificationToken
   *
   * OAuth 로그인 시 필요한 사용자 정보를
   * MongoDB에 자동으로 생성 및 관리한다.
   */
  adapter: MongoDBAdapter(clientPromise),

  /**
   * OAuth 인증 중 오류가 발생하면
   * 홈 페이지로 이동한다.
   *
   * 예:
   * /?error=Configuration
   * /?error=AccessDenied
   */
  pages: {
    error: "/",
  },

  /**
   * OAuth 로그인 제공자 목록.
   *
   * 현재는 Google 로그인만 사용한다.
   */
  providers: [
    Google({
      /**
       * Google Cloud Console에서 발급받은
       * OAuth Client ID.
       */
      clientId: process.env.GOOGLE_CLIENT_ID,

      /**
       * Google Cloud Console에서 발급받은
       * OAuth Client Secret.
       */
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,

      /**
       * Google OAuth 추가 인증 옵션.
       *
       * prompt: "consent"
       * - 로그인할 때마다 권한 동의 화면을 표시한다.
       * - 이미 로그인한 계정이어도 재동의를 요청한다.
       */
      authorization: {
        params: {
          prompt: "consent",
        },
      },
    }),
  ],
});
