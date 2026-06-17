import { UserRole } from "@/features/users/constants/user-role";
import "next-auth";
import { DefaultSession, DefaultUser } from "next-auth";
import { ImageInfo } from "../lib/cloudinary/image-info.model";

declare module "next-auth" {
  /**
   * 세션에서 사용자 정보 확장
   */
  interface Session {
    user: {
      id: string;
      role: UserRole;
      email: string;
      profileImage?: ImageInfo | null; // 기존 string에서 ImageInfo 객체로 변경
    } & DefaultSession["user"];
  }

  /**
   * DB에서 가져오는 User 객체 확장
   */
  interface User extends DefaultUser {
    role: UserRole;
    profileImage?: ImageInfo | null; // User 객체에도 반영
  }
}

declare module "next-auth/jwt" {
  /**
   * JWT 토큰 확장
   */
  interface JWT {
    id: string;
    role: UserRole;
    profileImage?: ImageInfo | null;
  }
}
