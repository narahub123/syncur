import { SubscriptionViewType } from "../../mocks/subscription-mock";
import SiteAvatar from "../SiteAvatar";

type Props = {
  item: SubscriptionViewType;
};

const SubscriptionSiteCard = ({ item }: Props) => {
  const { favicon_url, siteName } = item;
  const site = {};
  return (
    <div className="flex items-center gap-1">
      <SiteAvatar site={{ favicon_url, name: siteName }} />
      <span className="text-sm">{siteName}</span>
    </div>
  );
};

export default SubscriptionSiteCard;
