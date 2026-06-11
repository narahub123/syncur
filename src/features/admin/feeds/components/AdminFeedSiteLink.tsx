import { FeedWithSiteDto } from "@/features/feeds/dto/feedDto";
import SiteLinkCard from "@/features/rss/site/components/SiteLinkCard";

type Props = { feed: FeedWithSiteDto };
const AdminFeedSiteLink = ({ feed }: Props) => {
  return <SiteLinkCard site={feed.site} />;
};

export default AdminFeedSiteLink;
