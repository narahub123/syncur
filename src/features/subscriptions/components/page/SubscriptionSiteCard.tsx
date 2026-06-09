import { SubscriptionItemDto } from "../../dto/subscriptionDto";
import SiteAvatar from "../SiteAvatar";

type Props = {
  item: SubscriptionItemDto;
};

const SubscriptionSiteCard = ({ item }: Props) => {
  const { favicon_url, siteName } = item;

  console.log(item);

  return (
    <div className="flex items-center gap-1">
      <SiteAvatar site={{ favicon_url: favicon_url ?? "", name: siteName }} />
      <span className="text-sm">{siteName}</span>
    </div>
  );
};

export default SubscriptionSiteCard;
