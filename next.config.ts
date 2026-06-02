import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * 외부 이미지 허용 목록.
   *
   * OAuth 로그인 시 제공자의 프로필 이미지를
   * next/image 컴포넌트로 표시하기 위해 등록한다.
   *
   * 사용 예정:
   * - Google
   * - Kakao
   * - GitHub
   * - Discord
   */
  images: {
    remotePatterns: [
      /**
       * Google 프로필 이미지
       */
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },

      /**
       * Kakao 프로필 이미지
       */
      {
        protocol: "https",
        hostname: "k.kakaocdn.net",
      },

      /**
       * GitHub 프로필 이미지
       */
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },

      /**
       * Discord 프로필 이미지
       */
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
      },
    ],
  },
};

export default nextConfig;
