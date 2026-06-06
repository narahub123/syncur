import { SubscriptionListDto } from "../../dto/subscriptionDto";
import SubscriptionSiteCard from "./SubscriptionSiteCard";
import SubscriptionToggleButton from "./SubscriptionToggleButton";

type Props = {
  item: SubscriptionListDto;
};

const SubscriptionItem = ({ item }: Props) => {
  return (
    <li className="flex items-center justify-between p-2">
      <SubscriptionSiteCard item={item} />
      <SubscriptionToggleButton siteId={item.siteId} />
    </li>
  );
};

export default SubscriptionItem;
