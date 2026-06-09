import { FeedItemResponse } from "@/features/feeds/dto/feedDto";
import BookmarkCard from "./BookmarkCard";

type Props = {
  bookmarks: FeedItemResponse[];
};

const BookmarkList = ({ bookmarks }: Props) => {
  return (
    <ul>
      {bookmarks.map((bookmark) => (
        <BookmarkCard key={bookmark.content.feedItemId} bookmark={bookmark} />
      ))}
    </ul>
  );
};

export default BookmarkList;
