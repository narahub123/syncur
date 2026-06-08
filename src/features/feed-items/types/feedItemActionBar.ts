import { FeedAction } from "@/features/feed-interaction/types/feedActionDispatcher";
import { LucideIcon } from "lucide-react";

export type FeedActionUI = {
  icon: LucideIcon;
  title: string;

  action: FeedAction;

  isToggle?: boolean;
};
