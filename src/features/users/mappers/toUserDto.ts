import { UserDto } from "../dto/userDto";
import { UserLean } from "../types/lean";

/**
 * User -> UserResponse DTO Mapper
 *
 * - MongoDB Lean Object를
 * - Frontend-safe Response 형태로 변환
 *
 * 변환 규칙:
 * - _id -> id (string)
 * - Date -> ISO string
 * - 그대로 사용 가능한 필드는 유지
 */
export function toUserDto(user: UserLean): UserDto {
  return {
    _id: user._id.toString(),

    name: user.name,
    email: user.email,

    emailVerified: user.emailVerified ? user.emailVerified.toISOString() : null,

    image: user.image,

    profileImage: user.profileImage,

    onboardingCompleted: user.onboardingCompleted,
    onboardingCompletedAt: user.onboardingCompletedAt
      ? user.onboardingCompletedAt.toISOString()
      : null,

    role: user.role,

    createdAt: user.createdAt?.toISOString() ?? "",
    updatedAt: user.updatedAt?.toISOString() ?? "",
  };
}

export function toUserDtos(users: UserLean[]): UserDto[] {
  return users.map(toUserDto);
}
