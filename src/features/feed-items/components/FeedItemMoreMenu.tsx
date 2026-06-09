"use client";

import { useState } from "react";
import { useFeedAction } from "@/features/feed-interaction/hooks/useFeedAction";
import { FEED_ACTION } from "@/features/feed-interaction/types/feedActionDispatcher";
import { useSubscriptionToggleMutation } from "@/features/subscriptions/hooks/useSubscriptionToggleMutation";
import { createFeedItemActions } from "../context/createFeedItemActions";
import { MoreMenu } from "@/shared/components/common/MoreMenu/MoreMenu";
import CollectionDialog from "@/features/bookmarks/components/CollectionDialog";

type Props = {
  feedItemId: string;
  feedId: string;
  context: "feed" | "bookmark";
};

const FeedItemMoreMenu = ({ feedItemId, feedId, context }: Props) => {
  const [isSubscribed, setIsSubscribed] = useState(true);
  const [collections, setCollections] = useState<string[]>([]);
  const [isCollectionDialogOpen, setIsCollectionDialogOpen] = useState(false);

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

  const hasCollections = collections.length !== 0;

  const actions = createFeedItemActions({
    isSubscribed,
    hasCollections,
    onHide: handleHide,
    onToggleSubscription: handleToggleSubscription,
    context,
    onOpenCollectionModal: () => setIsCollectionDialogOpen(true),
  });

  return (
    <>
      <CollectionDialog
        open={isCollectionDialogOpen}
        onClose={() => setIsCollectionDialogOpen(false)}
      />
      <MoreMenu actions={actions} />
    </>
  );
};

export default FeedItemMoreMenu;
