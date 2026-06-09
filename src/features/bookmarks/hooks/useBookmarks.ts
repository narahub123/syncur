import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { bookmarksInfiniteQueryOptions } from "../queries/bookmarksInfiniteQueryOptions";
import { FeedResponse } from "@/features/feeds/dto/feedDto";

type Page = FeedResponse;
type PageParam = string | undefined;

export function useBookmarks() {
  return useInfiniteQuery<Page, Error, InfiniteData<Page>, string[], PageParam>(
    bookmarksInfiniteQueryOptions,
  );
}
