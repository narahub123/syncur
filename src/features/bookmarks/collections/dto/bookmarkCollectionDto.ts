/**
 * BookmarkCollection DTO
 */
export type BookmarkCollectionDto = {
  _id: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type BookmarkCollectionUnifiedSearchResponse = {
  user: BookmarkCollectionDto[];
  global: BookmarkCollectionDto[];
};
