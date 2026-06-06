export type SubscriptionListDto = {
  subscriptionId: string;
  siteId: string;
  siteName: string;
  siteUrl: string;
  favicon_url: string | null;

  created_at: string;
  updated_at: string;
};
