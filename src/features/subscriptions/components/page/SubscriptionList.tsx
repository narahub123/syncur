import { SubscriptionListDto } from "../../dto/subscriptionDto";
import SubscriptionItem from "./SubscriptionItem";

type Props = {
  subscriptions: SubscriptionListDto[];
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
