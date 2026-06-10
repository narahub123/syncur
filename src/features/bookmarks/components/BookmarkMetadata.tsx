import { formatRelativeTime } from "@/shared/utils/date";
import { BookmarkCollectionResponse } from "../dto/bookmarkDto";
import CollectionUpdateButton from "../collections/components/CollectionUpdateButton";

type Props = {
  bookmarkMeta: BookmarkMetaDto;
  collection: BookmarkCollectionResponse | null;
  feedItemId: string;
};

const BookmarkMetadata = ({ bookmarkMeta, collection, feedItemId }: Props) => {
  const { bookmarkedAt } = bookmarkMeta;
  const { display, full } = formatRelativeTime(bookmarkedAt);

  return (
    <div className="flex items-center gap-1">
      <span className="text-xs" title={full}>
        {display}
      </span>

      <CollectionUpdateButton collection={collection} feedItemId={feedItemId} />
    </div>
  );
};

export default BookmarkMetadata;
