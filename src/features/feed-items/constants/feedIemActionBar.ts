import { Bookmark, Heart, Share2 } from "lucide-react";
import { FeedActionUI } from "../types/feedItemActionBar";

export const feedActions: FeedActionUI[] = [
  {
    type: "LIKE",
    icon: Heart,
    title: "좋아요",
    action: "LIKE",
    isToggle: true,
  },
  {
    type: "BOOKMARK",
    icon: Bookmark,
    title: "북마크",
    action: "BOOKMARK",
    isToggle: true,
  },
  {
    type: "SHARE",
    icon: Share2,
    title: "Share",
    action: "SHARE",
    isToggle: false,
  },
];
