import { FeedItemResponse, FeedState } from "@/features/feeds/dto/feedDto";
import { CursorPaginationResponse } from "@/shared/types/pagination";

export type BookmarkCollectionResponse = {
  collectionId: string;
  collectionName: string;
};

export type BookmarkResponse = CursorPaginationResponse<BookmarkItemDto> & {
  status: FeedState;
};

export type BookmarkItemDto = FeedItemResponse & {
  collection: BookmarkCollectionResponse | null;
};

export type BookmarkActionResponse = {
  success: boolean;
  data: BookmarkResponse;
  error?: string;
};
