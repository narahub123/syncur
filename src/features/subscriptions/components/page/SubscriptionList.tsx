import { SubscriptionViewType } from "../../mocks/subscription-mock";
import SubscriptionItem from "./SubscriptionItem";

type Props = {
  subscriptions: SubscriptionViewType[];
};

const SubscriptionList = ({ subscriptions }: Props) => {
  return (
    <ul>
      {subscriptions.map((item) => (
        <SubscriptionItem key={item.subscriptionId} item={item} />
      ))}
    </ul>
  );
};

export default SubscriptionList;
