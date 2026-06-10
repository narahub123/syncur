import { InfiniteData, infiniteQueryOptions } from "@tanstack/react-query";
import { getBookmarksAction } from "../actions/getBookmarksAction";
import { FeedResponse } from "@/features/feeds/dto/feedDto";

type Page = FeedResponse;
type PageParam = string | undefined;

export const bookmarksInfiniteQueryOptions = infiniteQueryOptions<
  Page,
  Error,
  InfiniteData<Page>,
  string[],
  PageParam
>({
  queryKey: ["bookmarks"],

  initialPageParam: undefined,

  queryFn: async ({ pageParam }) => {
    const res = await getBookmarksAction(pageParam);

    // =========================
    // 핵심: Feed와 동일하게 data만 반환
    // =========================
    if (!res.success) {
      throw new Error(res.error);
    }

    return res.data;
  },

  getNextPageParam: (lastPage) =>
    lastPage.hasNext ? lastPage.nextCursor : undefined,
});
