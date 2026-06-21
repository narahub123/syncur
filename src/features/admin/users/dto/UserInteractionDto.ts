export type UserFeedInteractionPopulatedDto = {
  _id: string;
  userId: string;
  feedItemId: { _id: string; title: string; url: string };
  hasContentClicked: boolean;
  hasSourceClicked: boolean;
  hasLiked: boolean;
  hasBookmarked: boolean;
  isHidden: boolean;

  // JSON 직렬화를 위해 Date -> string으로 변경
  lastInteractedAt: string | null;
  lastContentClickedAt: string | null;
  lastSourceClickedAt: string | null;
  lastLikedAt: string | null;
  lastBookmarkedAt: string | null;
  hiddenAt: string | null;
  createdAt: string;
  updatedAt: string;
};
