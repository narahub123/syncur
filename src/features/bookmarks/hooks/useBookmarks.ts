import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { bookmarksInfiniteQueryOptions } from "../queries/bookmarksInfiniteQueryOptions";
import { BookmarkResponse } from "../dto/bookmarkDto";

type Page = BookmarkResponse;
type PageParam = string | undefined;

export function useBookmarks() {
  return useInfiniteQuery<Page, Error, InfiniteData<Page>, string[], PageParam>(
    bookmarksInfiniteQueryOptions,
  );
}
