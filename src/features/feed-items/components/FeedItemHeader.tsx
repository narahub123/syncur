import { FeedItemMetaDto } from "@/features/feeds/dto/feedDto";
import FeedItemMoreMenu from "./FeedItemMoreMenu";
import FeedSourceCard from "./FeedSourceCard";

type Props = {
  meta: FeedItemMetaDto;
};

const FeedItemHeader = ({ meta }: Props) => {
  return (
    <div className="flex items-center justify-between">
      <FeedSourceCard meta={meta} />
      <FeedItemMoreMenu />
    </div>
  );
};

export default FeedItemHeader;
