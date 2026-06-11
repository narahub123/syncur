import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FeedAction } from "../types/feedActionDispatcher";
import { FeedItemResponse } from "@/features/feeds/dto/feedDto";
import { handleFeedAction } from "../actions/handleFeedAction";
import { BookmarkItemDto } from "@/features/bookmarks/dto/bookmarkDto";

export type MyFeedItemsResponse = {
  success: boolean;
  data: (FeedItemResponse | BookmarkItemDto)[];
};
export function useFeedAction(feedItemId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (action: FeedAction) =>
      handleFeedAction({ feedItemId, action }),

    onMutate: async (action) => {
      await qc.cancelQueries({ queryKey: ["my-feed-items"] });
      await qc.cancelQueries({ queryKey: ["bookmarks"] });
      await qc.cancelQueries({ queryKey: ["my-likes"] });

      const prev = {
        myFeed: qc.getQueryData(["my-feed-items"]),
        bookmarks: qc.getQueryData(["bookmarks"]),
        myLikes: qc.getQueryData(["my-likes"]),
      };

      qc.setQueryData(
        ["my-feed-items"],
        (old: MyFeedItemsResponse | undefined) =>
          updateFeed(old as MyFeedItemsResponse, action, feedItemId),
      );

      qc.setQueryData(["bookmarks"], (old: MyFeedItemsResponse | undefined) =>
        updateFeed(old as MyFeedItemsResponse, action, feedItemId),
      );

      qc.setQueryData(["my-likes"], (old: MyFeedItemsResponse | undefined) => {
        if (!old?.data) return old;

        if (action !== "LIKE") return old;

        const exists = old.data.some(
          (item) => item.meta.feedItemId === feedItemId,
        );

        if (exists) {
          return {
            ...old,
            data: old.data.filter(
              (item) => item.meta.feedItemId !== feedItemId,
            ),
          };
        }

        // LIKE 추가 시에는 구조상 feedItem 전체가 있어야 하므로
        // 여기서는 optimistic insert는 제한적으로 처리
        return old;
      });

      return { prev };
    },

    onError: (_err, _action, ctx) => {
      qc.setQueryData(["my-feed-items"], ctx?.prev.myFeed);
      qc.setQueryData(["bookmarks"], ctx?.prev.bookmarks);
      qc.setQueryData(["my-likes"], ctx?.prev.myLikes);
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["my-feed-items"] });
      qc.invalidateQueries({ queryKey: ["bookmarks"] });
      qc.invalidateQueries({ queryKey: ["my-likes"] });
    },
  });
}

function updateFeed(
  old: MyFeedItemsResponse,
  action: FeedAction,
  feedItemId: string,
) {
  if (!old?.data) return old;

  const updatedData = old.data.map((item) => {
    if (item.meta.feedItemId !== feedItemId) return item;

    const interaction = { ...item.interaction };
    const stats = { ...item.stats };

    switch (action) {
      case "LIKE":
        interaction.hasLiked = !interaction.hasLiked;
        stats.likeCount += interaction.hasLiked ? 1 : -1;
        break;

      case "BOOKMARK":
        interaction.hasBookmarked = !interaction.hasBookmarked;
        stats.bookmarkCount += interaction.hasBookmarked ? 1 : -1;
        break;

      case "SHARE":
        stats.shareCount += 1;
        break;
    }

    return {
      ...item,
      interaction,
      stats,
    };
  });

  return {
    ...old,
    data: updatedData,
  };
}
