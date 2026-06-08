import { Button } from "@/shared/components/ui/button";
import { feedActions } from "../constants/feedIemActionBar";
import { useFeedAction } from "@/features/feed-interaction/hooks/useFeedAction";
import {
  FeedItemInteractionDto,
  FeedItemStatsDto,
} from "@/features/feeds/dto/feedDto";
import {
  FEED_ACTION,
  FeedAction,
} from "@/features/feed-interaction/types/feedActionDispatcher";

const FeeditemActionBar = ({
  feedItemId,
  stats,
  interaction,
}: {
  feedItemId: string;
  stats: FeedItemStatsDto;
  interaction: FeedItemInteractionDto;
}) => {
  const { bookmarkCount, likeCount, shareCount } = stats;
  const { hasBookmarked, hasLiked } = interaction;

  const mutation = useFeedAction(feedItemId);

  const count = (action: FeedAction) =>
    action === FEED_ACTION.BOOKMARK
      ? bookmarkCount
      : action === FEED_ACTION.LIKE
        ? likeCount
        : shareCount;

  const isFilled = (action: FeedAction) => {
    if (action === FEED_ACTION.LIKE) return hasLiked;
    if (action === FEED_ACTION.BOOKMARK) return hasBookmarked;
    return false;
  };

  const getColor = (action: FeedAction, filled: boolean) => {
    if (!filled) return "text-gray-400";

    switch (action) {
      case FEED_ACTION.LIKE:
        return "text-red-500";
      case FEED_ACTION.BOOKMARK:
        return "text-blue-500";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="flex items-center">
      {feedActions.map((action) => {
        const filled = isFilled(action.action);

        return (
          <Button
            key={action.action}
            className="flex h-12 flex-1 cursor-pointer items-center justify-center gap-2"
            variant="ghost"
            title={action.title}
            onClick={() => mutation.mutate(action.action)}
          >
            <action.icon
              fill={filled ? "currentColor" : "none"}
              className={`${filled ? "stroke-none" : ""} ${getColor(action.action, filled)}`}
            />
            <span
              className={`text-md ${isFilled(action.action) ? getColor(action.action, filled) : "text-gray-500"}`}
            >
              {count(action.action)}
            </span>
          </Button>
        );
      })}
    </div>
  );
};

export default FeeditemActionBar;
