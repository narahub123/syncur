import { FeedWithSiteDto } from "@/features/feeds/dto/feedDto";
import { AdminFeedStatusSelect } from "../components/AdminFeedStatusSelect";
import AdminFeedErrorCountInput from "../components/AdminFeedErrorCountInput";
import AdminFeedSiteLink from "../components/AdminFeedSiteLink";

export const adminFeedTableColumns = [
  {
    key: "siteName",
    header: "사이트",
    render: (feed: FeedWithSiteDto) => <AdminFeedSiteLink feed={feed} />,
  },
  {
    key: "feedUrl",
    header: "feed URL",
    render: (feed: FeedWithSiteDto) => feed.feedUrl,
  },
  {
    key: "status",
    header: "상태",
    render: (feed: FeedWithSiteDto) => <AdminFeedStatusSelect feed={feed} />,
  },
  {
    key: "errorCount",
    header: "에러",
    render: (feed: FeedWithSiteDto) => <AdminFeedErrorCountInput feed={feed} />,
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
