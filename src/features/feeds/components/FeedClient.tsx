"use client";

import SiteSubscriptionForm from "@/features/subscriptions/components/SiteSubscriptionForm";
import { useState } from "react";
import { useMyFeedItems } from "../hooks/useMyFeedItems";
import FeedList from "./FeedList";
import { FeedItemSkeleton } from "@/shared/components/common/FeedItemSkeleton";
import EmptyFeed from "./EmptyFeed";
import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import LoadMoreTrigger from "@/shared/components/common/LoadMoreTrigger";
import UnreadFeedIndicator from "./UnreadFeedIndicator";
import { InterestOnboardingDialog } from "@/features/interests/components/InterestOnboardingDialog";
import { UrlInput } from "@/features/ingestion/components/UrlInput";

type FeedClientProps = {
  isFirstLogin: boolean;
};

const FeedClient = ({ isFirstLogin }: FeedClientProps) => {
  const [isOpen, setIsOpen] = useState(isFirstLogin);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useMyFeedItems();

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
      <InterestOnboardingDialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
      />

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

      <UrlInput />

      {!isLoading && status === "HAS_DATA" && (
        <>
          <UnreadFeedIndicator />
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

export default FeedClient;
