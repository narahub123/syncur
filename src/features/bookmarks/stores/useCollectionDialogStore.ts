import { create } from "zustand";
import { BookmarkCollectionResponse } from "../dto/bookmarkDto";

type CollectionDialogStore = {
  /**
   * 다이얼로그 열림 여부
   */
  isOpen: boolean;

  /**
   * 현재 수정 중인 FeedItem
   */
  feedItemId: string | null;

  collection: BookmarkCollectionResponse | null;

  /**
   * 다이얼로그 열기
   */
  openDialog: (
    feedItemId: string,
    collection?: BookmarkCollectionResponse | null,
  ) => void;

  /**
   * 다이얼로그 닫기
   */
  closeDialog: () => void;
};

export const useCollectionDialogStore = create<CollectionDialogStore>(
  (set) => ({
    isOpen: false,
    feedItemId: null,
    collection: null,

    openDialog: (feedItemId, collection) =>
      set({
        isOpen: true,
        feedItemId,
        collection,
      }),

    closeDialog: () =>
      set({
        isOpen: false,
        feedItemId: null,
      }),
  }),
);
