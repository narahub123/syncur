export type SubscriptionViewType = {
  subscriptionId: string;
  siteId: string;
  siteName: string;
  siteUrl: string;
  favicon_url: string;
};

export const mockSubscriptionView: SubscriptionViewType[] = [
  {
    subscriptionId: "sub_1",
    siteId: "site_1",
    siteName: "Frontend Dev Blog",
    siteUrl: "https://velog.io/@frontend-dev",
    favicon_url: "https://velog.io/favicon.ico",
  },
  {
    subscriptionId: "sub_2",
    siteId: "site_2",
    siteName: "React Community",
    siteUrl: "https://dev.to/react",
    favicon_url: "https://dev.to/favicon.ico",
  },
  {
    subscriptionId: "sub_3",
    siteId: "site_3",
    siteName: "Backend Guide",
    siteUrl: "https://medium.com/@backend-guide",
    favicon_url: "https://medium.com/favicon.ico",
  },
  {
    subscriptionId: "sub_4",
    siteId: "site_4",
    siteName: "Hacker News",
    siteUrl: "https://news.ycombinator.com",
    favicon_url: "https://news.ycombinator.com/favicon.ico",
  },
  {
    subscriptionId: "sub_5",
    siteId: "site_5",
    siteName: "CSS Tricks",
    siteUrl: "https://css-tricks.com",
    favicon_url: "https://css-tricks.com/favicon.ico",
  },
];
