import { Button } from "@/shared/components/ui/button";
import { feedActions } from "../constants/feedIemActionBar";
import { useFeedAction } from "@/features/feed-interaction/hooks/useFeedAction";
import {
  FeedItemInteractionDto,
  FeedItemStatsDto,
} from "@/features/feeds/dto/feedDto";
import { FeedAction } from "@/features/feed-interaction/types/feedActionDispatcher";

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
  const { hasBookmarked, hasLiked,  } = interaction;

  const mutation = useFeedAction(feedItemId);

  const count = (action: FeedAction) =>
    action === "BOOKMARK"
      ? bookmarkCount
      : action === "LIKE"
        ? likeCount
        : shareCount;

  const isFilled = (action: FeedAction) => {
    if (action === "LIKE") return hasLiked;
    if (action === "BOOKMARK") return hasBookmarked;
    return false;
  };

  const getColor = (action: FeedAction, filled: boolean) => {
    if (!filled) return "text-gray-400";

    switch (action) {
      case "LIKE":
        return "text-red-500";
      case "BOOKMARK":
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
            className="flex h-12 flex-1 cursor-pointer justify-center"
            variant="ghost"
            size="icon-lg"
            title={action.title}
            onClick={() => mutation.mutate(action.action)}
          >
            <action.icon
              fill={filled ? "currentColor" : "none"}
              className={`${filled ? "stroke-none" : ""} ${getColor(action.action, filled)}`}
            />
            <span>{count(action.action)}</span>
          </Button>
        );
      })}
    </div>
  );
};

export default FeeditemActionBar;
