import FeeditemActionBar from "@/features/feed-items/components/FeeditemActionBar";
import FeedItemCategories from "@/features/feed-items/components/FeedItemCategories";
import FeedItemContent from "@/features/feed-items/components/FeedItemContent";
import BookmarkHeader from "./BookmarkHeader";
import { BookmarkItemDto } from "../dto/bookmarkDto";
import CollectionDialog from "../collections/components/CollectionDialog";

type Props = {
  bookmark: BookmarkItemDto;
};

const BookmarkCard = ({ bookmark }: Props) => {
  const { meta, content, categories, interaction, stats, collection } =
    bookmark;

  const bookmarkMeta: BookmarkMetaDto = {
    bookmarkedAt: interaction.lastBookmarkedAt,
  };

  return (
    <li className="border-b border-gray-200 pt-4">
      <CollectionDialog />
      <BookmarkHeader
        meta={meta}
        bookmarkMeta={bookmarkMeta}
        collection={collection}
      />
      <FeedItemContent item={content} />
      <FeedItemCategories categories={categories} />
      <FeeditemActionBar
        feedItemId={meta.feedItemId}
        stats={stats}
        interaction={interaction}
      />
    </li>
  );
};

export default BookmarkCard;
