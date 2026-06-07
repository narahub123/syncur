import FeedItemHeader from "./FeedItemHeader";
import FeeditemActionBar from "./FeeditemActionBar";
import FeedItemContent from "./FeedItemContent";
import { FeedItemResponse } from "@/features/feeds/dto/feedDto";
import FeedItemCategories from "./FeedItemCategories";

type Props = {
  item: FeedItemResponse;
};

const FeedItemCard = ({ item }: Props) => {
  const { meta, content, categories } = item;
  return (
    <li className="border-b border-gray-200 p-4">
      <FeedItemHeader meta={meta} />
      <FeedItemContent item={content} />
      <FeedItemCategories categories={categories} />
      <FeeditemActionBar />
    </li>
  );
};

export default FeedItemCard;
