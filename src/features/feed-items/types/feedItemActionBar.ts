import { FeedAction } from "@/features/feed-interaction/types/feedActionDispatcher";
import { LucideIcon } from "lucide-react";

export type FeedActionUI = {
  type: "LIKE" | "BOOKMARK" | "SHARE";
  icon: LucideIcon;
  title: string;

  action: FeedAction;

  isToggle?: boolean;
};
