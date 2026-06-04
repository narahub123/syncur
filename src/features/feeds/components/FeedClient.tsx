"use client";

import InterestSelectionModal from "@/features/interests/components/InterestSelectionModal";
import SiteSubscriptionForm from "@/features/subscriptions/components/SiteSubscriptionForm";
import { useState } from "react";

type FeedClientProps = {
  isFirstLogin: boolean;
};

const FeedClient = ({ isFirstLogin }: FeedClientProps) => {
  const [isOpen, setIsOpen] = useState(isFirstLogin);

  return (
    <div>
      <InterestSelectionModal open={isOpen} onClose={() => setIsOpen(false)} />
      <section className="p-4">
        <SiteSubscriptionForm />
      </section>
    </div>
  );
};

export default FeedClient;
