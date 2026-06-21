import { UserFeedInteractionPopulatedDto } from "../dto/UserInteractionDto";
import { UserFeedInteractionPopulatedLean } from "../types/leans";

export const toUserFeedInteractionPopulatedDto = (
  item: UserFeedInteractionPopulatedLean,
): UserFeedInteractionPopulatedDto => {
  return {
    _id: item._id.toString(),
    userId: item.userId.toString(),
    feedItemId: {
      _id: item.feedItemId._id.toString(),
      title: item.feedItemId.title,
      url: item.feedItemId.url,
    },
    hasContentClicked: item.hasContentClicked,
    hasSourceClicked: item.hasSourceClicked,
    hasLiked: item.hasLiked,
    hasBookmarked: item.hasBookmarked,
    isHidden: item.isHidden,

    // Date 필드들을 모두 string 또는 null로 변환
    lastInteractedAt: item.lastInteractedAt?.toISOString() || null,
    lastContentClickedAt: item.lastContentClickedAt?.toISOString() || null,
    lastSourceClickedAt: item.lastSourceClickedAt?.toISOString() || null,
    lastLikedAt: item.lastLikedAt?.toISOString() || null,
    lastBookmarkedAt: item.lastBookmarkedAt?.toISOString() || null,
    hiddenAt: item.hiddenAt?.toISOString() || null,

    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  };
};

export const toUserFeedInteractionPopulatedDtos = (
  items: UserFeedInteractionPopulatedLean[],
) => items.map(toUserFeedInteractionPopulatedDto);
