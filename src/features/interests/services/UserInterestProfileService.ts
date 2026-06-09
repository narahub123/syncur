import { UserInterestProfileLean } from "@/shared/types/domain-leans";
import { UserInterestProfileRepository } from "../repositories/UserInterestProfileRepository";
import { Interest } from "../types/interests";
import { requireAuth } from "@/shared/lib/auth/requireAuth";
import { convertInterests } from "../lib/convertInterests";

type UpdateUserInterestProfileServiceParams = {
  userEmail: string;
  categoryIds: string[];
  interestIds: string[];
};

/**
 * UserInterestProfile Service
 *
 * 사용자 관심사 비즈니스 로직 계층
 * - 온보딩 관심사 저장
 * - 관심사 조회
 * - repository 호출 제어
 */
export class UserInterestProfileService {
  constructor(
    private readonly userInterestProfileRepository: UserInterestProfileRepository,
  ) {}

  /**
   * 사용자 관심사 프로필 조회
   *
   * @param userEmail 사용자 이메일
   * @returns UserInterestProfileLean | null
   */
  async getProfile(userEmail: string): Promise<UserInterestProfileLean | null> {
    return this.userInterestProfileRepository.findByEmail(userEmail);
  }

  /**
   * 사용자 관심사 프로필 생성/수정 (온보딩 저장)
   *
   * - 최초 생성 or 업데이트 처리
   * - categoryIds / interestIds 저장
   *
   * @param userEmail 사용자 이메일
   * @param categoryIds 선택한 카테고리 ID 목록
   * @param interestIds 선택한 관심사 ID 목록
   * @returns 업데이트된 UserInterestProfileLean
   */
  async upsertProfile(params: {
    userEmail: string;
    categoryIds: string[];
    interestIds: string[];
  }): Promise<UserInterestProfileLean> {
    return this.userInterestProfileRepository.updateProfile(params);
  }

  /**
   * 현재 로그인한 사용자의 관심사 리스트 조회
   *
   * 처리 흐름:
   * 1. 인증 확인
   * 2. 관심사 프로필 조회
   * 3. interestIds → Interest 변환
   */
  async getCurrentUserInterestProfile(): Promise<Interest[]> {
    const session = await requireAuth();

    const userEmail = session.user?.email;

    if (!userEmail) {
      throw new Error("사용자 이메일을 확인할 수 없습니다.");
    }

    const profile =
      await this.userInterestProfileRepository.findByEmail(userEmail);

    const interestIds = profile?.interestIds ?? [];

    return convertInterests(interestIds);
  }

  /**
   * 사용자 관심사 프로필 업데이트 (upsert)
   *
   * 처리 방식:
   * - userEmail 기준으로 프로필 조회 후 없으면 생성
   * - 존재하면 categoryIds / interestIds 갱신
   *
   * 반환값을 사용하지 않는 이유:
   * - 관심사 저장은 상태 변경만 중요하고 결과 데이터가 필요 없음
   * - UI에서 즉시 다시 조회하지 않고 optimistic update 또는 refetch 사용
   */
  async updateUserInterestProfile({
    userEmail,
    categoryIds,
    interestIds,
  }: UpdateUserInterestProfileServiceParams): Promise<void> {
    await this.userInterestProfileRepository.updateProfile({
      userEmail,
      categoryIds,
      interestIds,
    });
  }
}
