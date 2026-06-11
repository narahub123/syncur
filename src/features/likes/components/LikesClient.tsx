"use client";

import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import { useMyLikes } from "../hooks/useMyLikes";
import { FeedItemSkeleton } from "@/shared/components/common/FeedItemSkeleton";
import EmptyFeed from "@/features/feeds/components/EmptyFeed";
import SiteSubscriptionForm from "@/features/subscriptions/components/SiteSubscriptionForm";
import FeedList from "@/features/feeds/components/FeedList";
import LoadMoreTrigger from "@/shared/components/common/LoadMoreTrigger";

const LikesClient = () => {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useMyLikes();

  const feedItems = data?.pages.flatMap((page) => page.items) ?? [];

  const status = data?.pages[0]?.status;

  const loadMoreRef = useInfiniteScroll({
    onIntersect: () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    enabled: !!hasNextPage,
  });

  return (
    <div>
      {isLoading && (
        <div>
          {[1, 2, 3].map((idx) => (
            <FeedItemSkeleton key={`feed-skeletion-${idx}`} />
          ))}
        </div>
      )}

      {!isLoading && status === "EMPTY_FEED" && <EmptyFeed />}

      {!isLoading && status === "NO_SUBSCRIPTION" && (
        <section className="p-4">
          <SiteSubscriptionForm />
        </section>
      )}

      {!isLoading && status === "HAS_DATA" && (
        <>
          <FeedList items={feedItems} />

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

export default LikesClient;
