"use client";

import { useState } from "react";
import { MoreVertical } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/shared/components/ui/dropdown-menu";

import { useFeedAction } from "@/features/feed-interaction/hooks/useFeedAction";
import { FEED_ACTION } from "@/features/feed-interaction/types/feedActionDispatcher";

import { useSubscriptionToggleMutation } from "@/features/subscriptions/hooks/useSubscriptionToggleMutation";

type Props = {
  feedItemId: string;
  feedId: string;
};

const FeedItemMoreMenu = ({ feedItemId, feedId }: Props) => {
  const [isSubscribed, setIsSubscribed] = useState(true);

  const feedActionMutation = useFeedAction(feedItemId);
  const subscriptionMutation = useSubscriptionToggleMutation();

  const handleHide = () => {
    feedActionMutation.mutate(FEED_ACTION.HIDE);
  };

  const handleToggleSubscription = () => {
    subscriptionMutation.mutate({
      isSubscribed,
      feedId,
    });

    setIsSubscribed((prev) => !prev);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="hover:bg-accent rounded-full p-1">
          <MoreVertical size={20} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent sideOffset={6} align="end">
        <DropdownMenuItem onClick={handleHide}>숨기기</DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleToggleSubscription}
          variant={isSubscribed ? "destructive" : "default"}
        >
          {isSubscribed ? "구독 해제" : "구독하기"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FeedItemMoreMenu;
