export interface UserFeedInteractionDTO {
  userId: string;
  feedItemId: string;

  hasContentClicked: boolean;
  hasSourceClicked: boolean;

  hasLiked: boolean;
  hasBookmarked: boolean;

  isHidden: boolean;

  lastInteractedAt?: string | null;

  lastContentClickedAt?: string | null;
  lastSourceClickedAt?: string | null;
  lastLikedAt?: string | null;
  lastBookmarkedAt?: string | null;
  hiddenAt?: string | null;

  createdAt: string;
  updatedAt: string;
}
