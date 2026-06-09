import { UserLean } from "@/shared/types/domain-leans";
import { UserRepository } from "../repositories/UserRepository";

/**
 * User Service
 *
 * 사용자 도메인 비즈니스 로직 계층
 * - 온보딩 상태 처리
 * - 사용자 조회
 * - auth 관련 사용자 상태 관리
 */
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * 이메일로 사용자 조회
   *
   * @param email 사용자 이메일
   * @returns UserLean | null
   */
  async getUserByEmail(email: string): Promise<UserLean | null> {
    return this.userRepository.findByEmail(email);
  }

  /**
   * 사용자 관심사 온보딩 완료 처리
   *
   * 처리 내용:
   * - onboardingCompleted = true
   * - onboardingCompletedAt = 현재 시간
   *
   * @param email 사용자 이메일
   * @returns 업데이트된 UserLean | null
   */
  async completeInterestOnboarding(email: string): Promise<UserLean | null> {
    return this.userRepository.completeInterestOnboarding(email);
  }
}
