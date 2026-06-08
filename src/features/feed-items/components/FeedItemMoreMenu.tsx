import { useFeedAction } from "@/features/feed-interaction/hooks/useFeedAction";
import {
  FEED_ACTION,
  FeedAction,
} from "@/features/feed-interaction/types/feedActionDispatcher";
import { Dropdown } from "@/shared/components/ui/Dropdown";
import { MoreVertical } from "lucide-react";

type Props = {
  feedItemId: string;
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

const FeedItemMoreMenu = ({ feedItemId }: Props) => {
  const mutation = useFeedAction(feedItemId);
  const defaultMenuItems: FeedItemDefaultMenuItemType[] = [
    {
      id: "hide",
      label: "숨기기",
      onClick: handleHideClick,
      action: FEED_ACTION.HIDE,
    },
  ];

  const destructiveMenuItems: FeedItemDestructiveMenuItemType[] = [
    {
      id: "leave",
      label: "구독 해제",
      onClick: handleUnsubscribeClick,
    },
  ];

  function handleHideClick(action: FeedAction) {
    mutation.mutate(action);
  }

  function handleUnsubscribeClick() {}

  return (
    <Dropdown.Root>
      <Dropdown.Trigger className="rounded-full">
        <MoreVertical size={20} />
      </Dropdown.Trigger>
      <Dropdown.Content>
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
