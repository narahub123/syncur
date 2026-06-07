import FeedItemMoreMenu from "./FeedItemMoreMenu";
import FeedSourceCard from "./FeedSourceCard";

const FeedItemHeader = () => {
  return (
    <div className="flex items-center justify-between">
      <FeedSourceCard />
      <FeedItemMoreMenu />
    </div>
  );
};

export default FeedItemHeader;
