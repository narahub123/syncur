import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";

import clientPromise from "@/shared/lib/db/mongodb";
import { USER_ROLE } from "./features/users/constants/user-role";
import { userStatsService } from "./features/admin/users/services/UserStatsService.instance";
import { userKeywordSettingService } from "./features/keywords/services/UserKeywordSettingService.instance";

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

  /**
   * session 콜백
   *
   * 역할:
   * - 클라이언트/서버에서 사용하는 session 객체를 가공
   * - DB(User document)에 있는 추가 필드를 session으로 전달
   *
   * 동작 흐름:
   * - NextAuth가 DB에서 user를 조회
   * - session.user에 필요한 정보(id, role 등)를 주입
   * - 이후 auth() / useSession()에서 사용 가능
   */
  callbacks: {
    async session({ session, user }) {
      // MongoDB User document의 id를 session에 주입
      session.user.id = user.id;

      // role이 없으면 기본값 "user"로 설정
      session.user.role = user.role ?? USER_ROLE.USER;

      return session;
    },

    /**
     * jwt 콜백
     *
     * 역할:
     * - JWT 토큰에 사용자 정보를 저장
     * - 이후 요청에서 DB 조회 없이 빠르게 인증 처리 가능
     *
     * 동작 흐름:
     * - 로그인 시 user 객체가 전달됨
     * - token에 role 같은 추가 정보를 저장
     * - 이후 요청에서는 token 기반으로 session 생성
     */
    async jwt({ token, user }) {
      // 최초 로그인 시에만 user 객체 존재
      if (user) {
        // role을 JWT 토큰에 저장 (없으면 기본값 "user")
        token.role = user.role ?? USER_ROLE.USER;
      }

      return token;
    },
  },
  events: {
    async createUser({ user }) {
      const db = (await clientPromise).db();

      // 1. 유저 역할 및 기본값 설정
      await db.collection("users").updateOne(
        { email: user.email },
        {
          $set: {
            role: USER_ROLE.USER,
            onboardingCompleted: false,
            onboardingCompletedAt: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
      );

      // 2. 가입 통계 기록 (signIn 콜백에서 뺄 것)
      const today = new Date().toISOString().split("T")[0];
      await userStatsService.recordNewUser(today);

      // 3. 키워드 기본 설정 생성 추가
      await userKeywordSettingService.createDefaultIfNotExists(user.id!);
    },
  },
});
