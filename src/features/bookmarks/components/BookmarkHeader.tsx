import FeedItemMoreMenu from "@/features/feed-items/components/FeedItemMoreMenu";
import FeedSourceCard from "@/features/feed-items/components/FeedSourceCard";
import { FeedItemMetaDto } from "@/features/feeds/dto/feedDto";
import BookmarkMetadata from "./BookmarkMetadata";

type Props = {
  meta: FeedItemMetaDto;
  bookmarkMeta: BookmarkMetaDto;
};

const BookmarkHeader = ({ meta, bookmarkMeta }: Props) => {
  return (
    <div className="flex items-center justify-between px-4">
      <FeedSourceCard meta={meta} />
      <BookmarkMetadata bookmarkMeta={bookmarkMeta} />
      <FeedItemMoreMenu feedItemId={meta.feedItemId} feedId={meta.feedId} />
    </div>
  );
};

export default BookmarkHeader;
