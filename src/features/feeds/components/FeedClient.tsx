"use client";

import InterestSelectionModal from "@/features/interests/components/InterestSelectionModal";
import SiteSubscriptionForm from "@/features/subscriptions/components/SiteSubscriptionForm";
import { useState } from "react";
import { useMyFeedItems } from "../hooks/useMyFeedItems";
import FeedList from "./FeedList";

type FeedClientProps = {
  isFirstLogin: boolean;
};

const FeedClient = ({ isFirstLogin }: FeedClientProps) => {
  const [isOpen, setIsOpen] = useState(isFirstLogin);

  const { data, isLoading, error } = useMyFeedItems();

  const feedItems = data?.data ?? [];

  console.log("목록", feedItems);
  return (
    <div>
      <InterestSelectionModal open={isOpen} onClose={() => setIsOpen(false)} />
      {feedItems.length === 0 && (
        <section className="p-4">
          <SiteSubscriptionForm />
        </section>
      )}
      {feedItems.length > 0 && <FeedList items={feedItems} />}
    </div>
  );
};

export default FeedClient;
