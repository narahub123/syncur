"use client";

import { useState } from "react";
import { useFeedAction } from "@/features/feed-interaction/hooks/useFeedAction";
import { FEED_ACTION } from "@/features/feed-interaction/types/feedActionDispatcher";
import { useSubscriptionToggleMutation } from "@/features/subscriptions/hooks/useSubscriptionToggleMutation";
import { createFeedItemActions } from "../context/createFeedItemActions";
import { MoreMenu } from "@/shared/components/common/MoreMenu/MoreMenu";
import { useCollectionDialogStore } from "@/features/bookmarks/stores/useCollectionDialogStore";
import { BookmarkCollectionResponse } from "@/features/bookmarks/dto/bookmarkDto";

type Props = {
  feedItemId: string;
  feedId: string;
  context: "feed" | "bookmark";
  collection?: BookmarkCollectionResponse | null;
};

const FeedItemMoreMenu = ({
  feedItemId,
  feedId,
  context,
  collection,
}: Props) => {
  const [isSubscribed, setIsSubscribed] = useState(true);
  const [collections, setCollections] = useState<string[]>([]);

  const openDialog = useCollectionDialogStore((s) => s.openDialog);

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
    onOpenCollectionModal: () => openDialog(feedItemId, collection),
  });

  return (
    <>
      <MoreMenu actions={actions} />
    </>
  );
};

export default FeedItemMoreMenu;
