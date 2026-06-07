import { FeedItem } from "@/shared/types/feed";

type Props = {
  item: FeedItem;
};

const FeedContent = ({ item }: Props) => {
  const { title, description } = item;
  return (
    <div className="space-y-1">
      <p className="text-sm font-medium">{title}</p>
      <p className="line-clamp-2 text-xs">{description}</p>
    </div>
  );
};

export default FeedContent;
