import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

/**
 * NextAuth v5 인증 설정.
 *
 * export 항목:
 * - handlers: 인증 API Route Handler에서 사용
 * - auth: 서버에서 현재 세션 조회
 * - signIn: Server Action에서 로그인 실행
 * - signOut: Server Action에서 로그아웃 실행
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  session: {
    strategy: "jwt",
  },
});
