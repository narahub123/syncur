"use client";

import InterestSelectionDialog from "@/features/interests/components/InterestSelectionDialog";
import SiteSubscriptionForm from "@/features/subscriptions/components/SiteSubscriptionForm";
import { useState } from "react";
import { useMyFeedItems } from "../hooks/useMyFeedItems";
import FeedList from "./FeedList";
import { FeedItemSkeleton } from "@/shared/components/common/FeedItemSkeleton";

type FeedClientProps = {
  isFirstLogin: boolean;
};

const FeedClient = ({ isFirstLogin }: FeedClientProps) => {
  const [isOpen, setIsOpen] = useState(isFirstLogin);

  const { data, isLoading, error } = useMyFeedItems();

  const feedItems = data?.data ?? [];

  return (
    <div>
      <InterestSelectionDialog open={isOpen} onClose={() => setIsOpen(false)} />
      {isLoading && (
        <div>
          {[1, 2, 3].map((idx) => (
            <FeedItemSkeleton key={`feed-skeletion-${idx}`} />
          ))}
        </div>
      )}
      {!isLoading && feedItems.length === 0 && (
        <section className="p-4">
          <SiteSubscriptionForm />
        </section>
      )}
      {!isLoading && feedItems.length > 0 && <FeedList items={feedItems} />}
    </div>
  );
};

export default FeedClient;
