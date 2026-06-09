import { SubscriptionItemDto } from "../../dto/subscriptionDto";
import SubscriptionToggleButton from "./SubscriptionToggleButton";
import SiteLinkCard, {
  SiteLinkCardDto,
} from "@/features/rss/site/components/SiteLinkCard";

type Props = {
  item: SubscriptionItemDto;
};

const SubscriptionItem = ({ item }: Props) => {
  const site: SiteLinkCardDto = {
    name: item.siteName,
    url: item.siteUrl,
    favicon_url: item.favicon_url,
  };
  return (
    <li className="flex items-center justify-between p-2">
      <SiteLinkCard site={site} />
      <SubscriptionToggleButton feedId={item.feedId} />
    </li>
  );
};

export default SubscriptionItem;
