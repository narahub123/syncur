import BookmarkCard from "./BookmarkCard";
import { BookmarkItemDto } from "../dto/bookmarkDto";

type Props = {
  bookmarks: BookmarkItemDto[];
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
