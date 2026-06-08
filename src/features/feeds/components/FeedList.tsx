import FeedItemCard from "@/features/feed-items/components/FeedItemCard";
import { FeedItemResponse } from "../dto/feedDto";

type Props = {
  items: FeedItemResponse[];
};

const FeedList = ({ items }: Props) => {
  return (
    <ul>
      {items.map((item) => (
        <FeedItemCard key={item.content.feedItemId} item={item} />
      ))}
    </ul>
  );
};

export default FeedList;
