import { FeedItemMetaDto } from "@/features/feeds/dto/feedDto";
import FeedItemMoreMenu from "./FeedItemMoreMenu";
import FeedSourceCard from "./FeedSourceCard";

type Props = {
  meta: FeedItemMetaDto;
};

const FeedItemHeader = ({ meta }: Props) => {
  return (
    <div className="flex items-center justify-between px-4">
      <FeedSourceCard meta={meta} />
      <FeedItemMoreMenu
        feedItemId={meta.feedItemId}
        feedId={meta.feedId}
        context="feed"
      />
    </div>
  );
};

export default FeedItemHeader;
