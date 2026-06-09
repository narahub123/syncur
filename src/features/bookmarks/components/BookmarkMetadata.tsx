import { formatRelativeTime } from "@/shared/utils/date";

type Props = {
  bookmarkMeta: BookmarkMetaDto;
};

const BookmarkMetadata = ({ bookmarkMeta }: Props) => {
  const { bookmarkedAt } = bookmarkMeta;
  const { display, full } = formatRelativeTime(bookmarkedAt);
  return (
    <div>
      <span className="text-sm" title={full}>
        {display}
      </span>
    </div>
  );
};

export default BookmarkMetadata;
