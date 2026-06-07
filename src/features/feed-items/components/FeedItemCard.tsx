import { FeedItem } from "@/shared/types/feed";
import FeedItemHeader from "./FeedItemHeader";
import FeeditemActionBar from "./FeeditemActionBar";
import FeedContent from "./FeedContent";

type Props = {
  item: FeedItem;
};

const FeedItemCard = ({ item }: Props) => {
  return (
    <li className="border-b border-gray-200 p-2">
      <FeedItemHeader />
      <FeedContent item={item} />
      <FeeditemActionBar />
    </li>
  );
};

export default FeedItemCard;
