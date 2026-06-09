import { FeedMoreMenuAction } from "@/shared/components/common/MoreMenu/types";

export const createFeedItemActions = (params: {
  isSubscribed: boolean;
  hasCollections: boolean;
  onHide: () => void;
  onToggleSubscription: () => void;
  onOpenCollectionModal: () => void;
  context: "feed" | "bookmark";
}): FeedMoreMenuAction[] => {
  const base: FeedMoreMenuAction[] = [
    {
      type: "hide",
      label: "숨기기",
      onClick: params.onHide,
    },
  ];

  if (params.context === "feed") {
    base.push(
      {
        type: "separator",
      },
      {
        type: "subscription",
        label: params.isSubscribed ? "구독 해제" : "구독하기",
        variant: params.isSubscribed ? "destructive" : "default",
        onClick: params.onToggleSubscription,
      },
    );
  }

  if (params.context === "bookmark") {
    base.unshift(
      {
        type: "bookmark",
        label: params.hasCollections ? "카테고리 수정" : "카테고리 추가",
        variant: "default",
        onClick: params.onOpenCollectionModal,
      },
      {
        type: "separator",
      },
    );
  }

  return base;
};
