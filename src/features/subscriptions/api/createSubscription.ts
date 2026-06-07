import { subscriptionRepository } from "../repository/SubscriptionRepository.instance";

/**
 * CreateSubscriptionInput
 * - 구독 생성 서비스 입력 타입
 */
type CreateSubscriptionInput = {
  userId: string;
  feedId: string;
};

/**
 * createSubscriptionService
 * - 구독 생성 비즈니스 로직 처리
 * - 중복 구독 방지 포함
 */
export async function createSubscriptionService(
  input: CreateSubscriptionInput,
) {
  const { userId, feedId } = input;

  /**
   * 1. 이미 해당 user가 site를 구독 중인지 확인
   */
  const exists = await subscriptionRepository.find(userId, feedId);

  /**
   * 2. 존재하면 기존 데이터 반환 (중복 생성 방지)
   */
  if (exists) {
    return exists;
  }

  /**
   * 3. 없으면 새 구독 생성
   */
  return await subscriptionRepository.create(userId, feedId);
}
