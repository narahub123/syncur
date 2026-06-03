"use client";

import InterestSelectionModal from "@/features/interests/components/InterestSelectionModal";
import { useState } from "react";

const FeedClient = () => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div>
      <InterestSelectionModal open={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

export default FeedClient;
