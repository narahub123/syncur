import { SubscriptionViewType } from "../../mocks/subscription-mock";
import SubscriptionSiteCard from "./SubscriptionSiteCard";
import SubscriptionToggleButton from "./SubscriptionToggleButton";

type Props = {
  item: SubscriptionViewType;
};

const SubscriptionItem = ({ item }: Props) => {
  return (
    <li className="flex items-center justify-between p-2">
      <SubscriptionSiteCard item={item} />
      <SubscriptionToggleButton />
    </li>
  );
};

export default SubscriptionItem;
