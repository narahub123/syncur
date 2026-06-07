import FeedItemCard from "@/features/feed-items/components/FeedItemCard";
import type { FeedItem } from "@/shared/types/feed";

type Props = {
  items: FeedItem[];
};

const FeedList = ({ items }: Props) => {
  return (
    <ul>
      {items.map((item) => (
        <FeedItemCard key={item._id} item={item} />
      ))}
    </ul>
  );
};

export default FeedList;
