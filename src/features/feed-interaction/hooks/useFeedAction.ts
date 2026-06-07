import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FeedAction } from "../types/feedActionDispatcher";
import { FeedItemResponse } from "@/features/feeds/dto/feedDto";
import { handleFeedAction } from "../actions/handleFeedAction";

export type MyFeedItemsResponse = {
  success: boolean;
  data: FeedItemResponse[];
};
export function useFeedAction(feedItemId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (action: FeedAction) =>
      handleFeedAction({ feedItemId, action }),

    onMutate: async (action) => {
      await qc.cancelQueries({ queryKey: ["my-feed-items"] });

      const prev = qc.getQueryData(["my-feed-items"]);

      qc.setQueryData(["my-feed-items"], (old: MyFeedItemsResponse) => {
        if (!old) return old;

        const updatedData = old.data.map((item: FeedItemResponse) => {
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
      });

      return { prev };
    },

    onError: (_err, _action, ctx) => {
      qc.setQueryData(["my-feed-items"], ctx?.prev);
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["my-feed-items"] });
    },
  });
}
