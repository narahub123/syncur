import { SubscriptionLean } from "@/shared/types/domain-leans";
import { SubscriptionDto } from "../dto/subscriptionDto";

/**
 * SubscriptionLean → SubscriptionItemDto 변환
 *
 * @description
 * MongoDB ObjectId / Date를 Client-safe string으로 변환
 */
export const toSubscriptionDto = (doc: SubscriptionLean): SubscriptionDto => {
  return {
    id: doc._id.toString(),
    userId: doc.userId.toString(),
    feedId: doc.feedId.toString(),

    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
};
