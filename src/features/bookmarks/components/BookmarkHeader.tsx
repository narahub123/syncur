import FeedItemMoreMenu from "@/features/feed-items/components/FeedItemMoreMenu";
import FeedSourceCard from "@/features/feed-items/components/FeedSourceCard";
import { FeedItemMetaDto } from "@/features/feeds/dto/feedDto";
import BookmarkMetadata from "./BookmarkMetadata";
import { BookmarkCollectionResponse } from "../dto/bookmarkDto";

type Props = {
  meta: FeedItemMetaDto;
  bookmarkMeta: BookmarkMetaDto;
  collection: BookmarkCollectionResponse | null;
};

const BookmarkHeader = ({ meta, bookmarkMeta, collection }: Props) => {
  return (
    <div className="flex items-center justify-between px-4">
      <FeedSourceCard meta={meta} />
      <BookmarkMetadata bookmarkMeta={bookmarkMeta} collection={collection} feedItemId={meta.feedItemId}/>
      <FeedItemMoreMenu
        feedItemId={meta.feedItemId}
        feedId={meta.feedId}
        context="bookmark"
      />
    </div>
  );
};

export default BookmarkHeader;
