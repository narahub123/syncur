import { SubscriptionItemDto } from "../../dto/subscriptionDto";
import SubscriptionSiteCard from "./SubscriptionSiteCard";
import SubscriptionToggleButton from "./SubscriptionToggleButton";

type Props = {
  item: SubscriptionItemDto;
};

const SubscriptionItem = ({ item }: Props) => {
  return (
    <li className="flex items-center justify-between p-2">
      <SubscriptionSiteCard item={item} />
      <SubscriptionToggleButton feedId={item.feedId} />
    </li>
  );
};

export default SubscriptionItem;
