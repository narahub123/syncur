export type AdminFeedSearchField =
  | "siteName"
  | "siteUrl"
  | "status"
  | "category";

export type AdminFeedSort =
  | "siteName"
  | "feedUrl"
  | "status"
  | "errorCount"
  | "lastFetchedAt"
  | "createdAt";

export type AdminFeedSortOrder = "asc" | "desc";

export type AdminFeedPageSize = 10 | 20 | 50 | 100;

export type AdminFeedsQuery = {
  search: string;
  searchField: AdminFeedSearchField;
  sort: AdminFeedSort;
  sortOrder: AdminFeedSortOrder;
  page: number;
  limit: AdminFeedPageSize;
};
