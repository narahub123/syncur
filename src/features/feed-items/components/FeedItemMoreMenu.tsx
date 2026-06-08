"use client";

import { useFeedAction } from "@/features/feed-interaction/hooks/useFeedAction";
import {
  FEED_ACTION,
  FeedAction,
} from "@/features/feed-interaction/types/feedActionDispatcher";
import { useSubscriptionToggleMutation } from "@/features/subscriptions/hooks/useSubscriptionToggleMutation";
import { Dropdown } from "@/shared/components/ui/Dropdown";
import { MoreVertical } from "lucide-react";
import { useState } from "react";

type Props = {
  feedItemId: string;
  feedId: string;
};

type FeedItemDefaultMenuItemType = {
  id: string;
  label: string;
  onClick: (action: FeedAction) => void;
  action: FeedAction;
};

type FeedItemDestructiveMenuItemType = {
  id: string;
  label: string;
  onClick: () => void;
};

const FeedItemMoreMenu = ({ feedItemId, feedId }: Props) => {
  const [isSubscribed, setIsSubscribed] = useState(true);
  const mutation = useFeedAction(feedItemId);
  const defaultMenuItems: FeedItemDefaultMenuItemType[] = [
    {
      id: "hide",
      label: "숨기기",
      onClick: handleHideClick,
      action: FEED_ACTION.HIDE,
    },
  ];

  const leaveLabel = isSubscribed ? "구독 해제" : "구독 추가";
  const destructiveMenuItems: FeedItemDestructiveMenuItemType[] = [
    {
      id: "leave",
      label: leaveLabel,
      onClick: handleUnsubscribeClick,
    },
  ];

  function handleHideClick(action: FeedAction) {
    mutation.mutate(action);
  }

  const toggleMutation = useSubscriptionToggleMutation();

  function handleUnsubscribeClick() {
    toggleMutation.mutate({
      feedId,
      isSubscribed,
    });
    setIsSubscribed(!isSubscribed);
  }

  return (
    <Dropdown.Root>
      <Dropdown.Trigger className="rounded-full">
        <MoreVertical size={20} />
      </Dropdown.Trigger>
      <Dropdown.Content isBgOn={false}>
        {defaultMenuItems.map((item) => (
          <Dropdown.Item
            key={item.id}
            onClick={() => item.onClick(item.action)}
          >
            {item.label}
          </Dropdown.Item>
        ))}
        <Dropdown.Separator />
        {destructiveMenuItems.map((item) => (
          <Dropdown.Item key={item.id} onClick={() => item.onClick()}>
            {item.label}
          </Dropdown.Item>
        ))}
      </Dropdown.Content>
    </Dropdown.Root>
  );
};

export default FeedItemMoreMenu;
