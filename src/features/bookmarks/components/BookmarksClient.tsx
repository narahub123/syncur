"use client";

import LoadMoreTrigger from "@/shared/components/common/LoadMoreTrigger";
import { useBookmarks } from "../hooks/useBookmarks";
import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import EmptyBookmarks from "./EmptyBookmarks";
import { FeedItemSkeleton } from "@/shared/components/common/FeedItemSkeleton";
import BookmarkList from "./BookmarkList";

const BookmarksClient = () => {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useBookmarks();

  const bookmarks = data?.pages.flatMap((page) => page.items) ?? [];

  const loadMoreRef = useInfiniteScroll({
    onIntersect: () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    enabled: !!hasNextPage,
  });

  const status = data?.pages[0]?.status;
  return (
    <div>
      {isLoading && (
        <div>
          {[1, 2, 3].map((idx) => (
            <FeedItemSkeleton key={`feed-skeletion-${idx}`} />
          ))}
        </div>
      )}
      {!isLoading && status === "EMPTY_FEED" && <EmptyBookmarks />}
      {!isLoading && status === "HAS_DATA" && (
        <>
          <BookmarkList bookmarks={bookmarks} />
          {/* 👇 무한스크롤 트리거 */}
          <LoadMoreTrigger ref={loadMoreRef} className="h-10" />

          {isFetchingNextPage && (
            <div className="p-4 text-center">loading...</div>
          )}
        </>
      )}
    </div>
  );
};

export default BookmarksClient;
