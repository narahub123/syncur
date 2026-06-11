import { FeedWithSiteDto } from "@/features/feeds/dto/feedDto";

export const adminFeedTableColumns = [
  {
    key: "siteName",
    header: "사이트",
    render: (feed: FeedWithSiteDto) => feed.site.name,
  },
  {
    key: "feedUrl",
    header: "feed URL",
    render: (feed: FeedWithSiteDto) => feed.feedUrl,
  },
  {
    key: "status",
    header: "상태",
    render: (feed: FeedWithSiteDto) => feed.status,
  },
  {
    key: "errorCount",
    header: "에러",
    render: (feed: FeedWithSiteDto) => feed.errorCount,
  },
  {
    key: "lastFetchedAt",
    header: "최근 수집",
    render: (feed: FeedWithSiteDto) =>
      feed.lastFetchedAt ? new Date(feed.lastFetchedAt).toLocaleString() : "-",
  },
  {
    key: "createdAt",
    header: "생성일",
    render: (feed: FeedWithSiteDto) =>
      new Date(feed.createdAt).toLocaleDateString(),
  },
] as const;
