"use client";

import { Button } from "@/shared/components/ui/button";
import { useState } from "react";
import { useSubscriptionToggleMutation } from "../../hooks/useSubscriptionToggleMutation";
import { LoaderCircle } from "lucide-react";

type Props = {
  siteId: string;
};

const SubscriptionToggleButton = ({ siteId }: Props) => {
  const [isSubscribed, setIsSubscribed] = useState(true);

  const toggleMutation = useSubscriptionToggleMutation();

  const handleClick = () => {
    toggleMutation.mutate({
      siteId,
      isSubscribed,
    });
    setIsSubscribed(!isSubscribed);
  };

  return (
    <Button
      className="text-xs"
      onClick={handleClick}
      disabled={toggleMutation.isPending}
    >
      {toggleMutation.isPending ? (
        <LoaderCircle className="animate-spin" />
      ) : isSubscribed ? (
        "구독해제"
      ) : (
        "구독하기"
      )}
    </Button>
  );
};

export default SubscriptionToggleButton;
