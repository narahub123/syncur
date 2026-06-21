import { UserFeedInteractionLean } from "@/shared/types/domain-leans";
import { UserFeedInteractionDTO } from "../dtos/userFeedInteractionDTO";

export function toUserFeedInteractionDTO(
  doc: UserFeedInteractionLean,
): UserFeedInteractionDTO {
  return {
    userId: doc.userId.toString(),
    feedItemId: doc.feedItemId.toString(),

    hasContentClicked: doc.hasContentClicked,
    hasSourceClicked: doc.hasSourceClicked,

    hasLiked: doc.hasLiked,
    hasBookmarked: doc.hasBookmarked,

    isHidden: doc.isHidden,

    lastInteractedAt: doc.lastInteractedAt?.toISOString() ?? null,

    lastContentClickedAt: doc.lastContentClickedAt?.toISOString() ?? null,
    lastSourceClickedAt: doc.lastSourceClickedAt?.toISOString() ?? null,
    lastLikedAt: doc.lastLikedAt?.toISOString() ?? null,
    lastBookmarkedAt: doc.lastBookmarkedAt?.toISOString() ?? null,
    hiddenAt: doc.hiddenAt?.toISOString() ?? null,

    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

export const toUserFeedInteractionDTOs = (items: UserFeedInteractionLean[]) =>
  items.map(toUserFeedInteractionDTO);
