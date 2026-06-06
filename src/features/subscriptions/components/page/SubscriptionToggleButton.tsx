"use client";

import { Button } from "@/shared/components/ui/button";
import { useState } from "react";

const SubscriptionToggleButton = () => {
  const [isSubscribed, setIsSubscribed] = useState(true);
  return (
    <Button className="text-xs">
      {isSubscribed ? "구독해제" : "구독하기"}
    </Button>
  );
};

export default SubscriptionToggleButton;
