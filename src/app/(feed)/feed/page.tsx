import FeedClient from "@/features/feeds/components/FeedClient";
import { getCurrentUserAction } from "@/features/users/actions/getCurrentUserAction";

/**
 * 메인 피드 페이지
 *
 * 처리 순서:
 * 1. 현재 로그인 사용자 조회
 * 2. 관심사 온보딩 완료 여부 확인
 * 3. 첫 로그인 사용자인 경우 관심사 선택 모달 표시
 */
const FeedPage = async () => {
  const user = await getCurrentUserAction();

  /**
   * 온보딩을 완료하지 않은 사용자만
   * 관심사 선택 모달을 표시한다.
   *
   * 주의:
   * - user가 null인 경우(조회 실패)는 false 처리한다.
   * - 조회 실패를 첫 로그인으로 간주하지 않는다.
   */
  const isFirstLogin = user?.onboardingCompleted === false;

  return <FeedClient isFirstLogin={isFirstLogin} />;
};

export default FeedPage;
