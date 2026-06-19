export type SubscriptionItemDto = {
  subscriptionId: string;

  feedId: string;

  siteName: string;
  siteUrl: string;
  favicon_url: string | null;

  createdAt: string;
  updatedAt: string;
};

/**
 * Subscription Client DTO
 *
 * - Client Component로 전달 가능한 "순수 객체"
 * - ObjectId / Date 모두 string으로 변환됨
 */
export type SubscriptionDto = {
  id: string;

  userId: string;
  feedId: string;

  deletedAt: string;
  createdAt: string;
  updatedAt: string;
};
