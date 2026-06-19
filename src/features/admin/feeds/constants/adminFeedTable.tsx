import { FeedWithSiteDto } from "@/features/feeds/dto/feedDto";
import { AdminFeedStatusSelect } from "../components/AdminFeedStatusSelect";
import AdminFeedErrorCountInput from "../components/AdminFeedErrorCountInput";
import AdminFeedSiteLink from "../components/AdminFeedSiteLink";
import { Column } from "../../types/admin-table";
import { AdminFeedSort } from "../types/search";

export const adminFeedTableColumns: Column<FeedWithSiteDto, AdminFeedSort>[] = [
  {
    key: "siteName",
    header: "사이트",
    render: (feed: FeedWithSiteDto) => <AdminFeedSiteLink feed={feed} />,
    sortable: true,
  },
  {
    key: "feedUrl",
    header: "feed URL",
    render: (feed: FeedWithSiteDto) => feed.feedUrl,
    sortable: true,
  },
  {
    key: "subscriberCount",
    header: "구독자 수",
    render: (feed: FeedWithSiteDto) => feed.subscriberCount,
    sortable: true,
  },
  {
    key: "status",
    header: "상태",
    render: (feed: FeedWithSiteDto) => <AdminFeedStatusSelect feed={feed} />,
    sortable: true,
  },
  {
    key: "errorCount",
    header: "에러",
    render: (feed: FeedWithSiteDto) => <AdminFeedErrorCountInput feed={feed} />,
    sortable: true,
  },
  {
    key: "lastFetchedAt",
    header: "최근 수집",
    render: (feed: FeedWithSiteDto) =>
      feed.lastFetchedAt ? new Date(feed.lastFetchedAt).toLocaleString() : "-",
    sortable: true,
  },
  {
    key: "createdAt",
    header: "생성일",
    render: (feed: FeedWithSiteDto) =>
      new Date(feed.createdAt).toLocaleDateString(),
    sortable: true,
  },
] as const;
