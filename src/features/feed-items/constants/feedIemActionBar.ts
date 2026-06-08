import { Bookmark, Heart, Share2 } from "lucide-react";
import { FeedActionUI } from "../types/feedItemActionBar";
import { FEED_ACTION } from "@/features/feed-interaction/types/feedActionDispatcher";

export const feedActions: FeedActionUI[] = [
  {
    action: FEED_ACTION.LIKE,
    icon: Heart,
    title: "좋아요",
    isToggle: true,
  },
  {
    action: FEED_ACTION.BOOKMARK,
    icon: Bookmark,
    title: "북마크",
    isToggle: true,
  },
  {
    action: FEED_ACTION.SHARE,
    icon: Share2,
    title: "공유",
    isToggle: false,
  },
];
