import { UserRole } from "@/features/users/constants/user-role";
import { ImageInfo } from "@/shared/lib/cloudinary/image-info.model";
import { PaginatedResponse } from "@/shared/types/pagination";
import { UserLean } from "../types/lean";

/**
 * User API Response Type
 *
 * - frontend에서 직접 사용하는 타입
 * - MongoDB / Mongoose 타입 제거
 * - ObjectId, Date 등을 직렬화된 형태로 변환
 * - UI/Client-safe 형태로 평탄화된 데이터
 */
export type UserDto = {
  /**
   * 사용자 ID (string으로 직렬화)
   */
  _id: string;

  /**
   * 사용자 이름
   */
  name: string | null;

  /**
   * 사용자 이메일
   */
  email: string;

  /**
   * 이메일 인증 완료 시각 (ISO string)
   */
  emailVerified: string | null;

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
   * 관심사 온보딩 완료 시각 (ISO string)
   */
  onboardingCompletedAt: string | null;

  /**
   * 사용자 권한
   */
  role: UserRole;

  createdAt: string;
  updatedAt: string;
};

export type UserLeanPaagedResponse = {
  items: UserLean[];
  totalCount: number;
};
export type UserDtoPagedResponse = PaginatedResponse<UserDto>;

// 프론트엔드용 공통 DTO
export interface UserBasicDto {
  _id: string;
  email: string;
  name: string;
  image: string | null;
  profileImage: ImageInfo | null;
  role: UserRole;
}
