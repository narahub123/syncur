"use client";

import InterestSelectionModal from "@/features/interests/components/InterestSelectionModal";
import { useState } from "react";

type FeedClientProps = {
  isFirstLogin: boolean;
};

const FeedClient = ({ isFirstLogin }: FeedClientProps) => {
  const [isOpen, setIsOpen] = useState(isFirstLogin);

  return (
    <div>
      <InterestSelectionModal open={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

export default FeedClient;
