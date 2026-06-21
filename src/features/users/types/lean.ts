import { ImageInfo } from "@/shared/lib/cloudinary/image-info.model";
import { Types } from "mongoose";
import { UserRole } from "../constants/user-role";

/**
 * UserModel lean() 반환 타입
 *
 * Document wrapper 없이 순수 JSON object
 */
export type UserLean = {
  /**
   * MongoDB ObjectId
   */
  _id: Types.ObjectId;

  /**
   * 사용자 이름
   */
  name: string | null;

  /**
   * 사용자 이메일
   */
  email: string;

  /**
   * 이메일 인증 완료 시각
   */
  emailVerified: Date | null;

  /**
   * 프로필 이미지 URL
   */
  image: string | null;

  profileImage: ImageInfo | null;

  /**
   * 관심사 온보딩 완료 여부
   */
  onboardingCompleted: boolean;

  /**
   * 관심사 온보딩 완료 시각
   */
  onboardingCompletedAt: Date | null;

  /**
   * 사용자 권한
   */
  role: UserRole;

  lastActiveAt: Date; // 마지막 활동 시각

  createdAt: Date;
  updatedAt: Date;
};

// DB Lean 조회용 타입
export interface UserBasicLean {
  _id: Types.ObjectId;
  email: string;
  name: string;
  image: string | null;
  profileImage: ImageInfo | null;
  role: UserRole;
}
