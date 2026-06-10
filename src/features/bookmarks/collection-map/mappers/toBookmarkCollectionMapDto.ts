import { BookmarkCollectionMapLean } from "@/shared/types/domain-leans";
import { BookmarkCollectionMapDto } from "../dto/bookmarkCollectionMapDto";

/**
 * CollectionMap Mapper
 *
 * 역할:
 * - DB Lean → API DTO 변환
 * - UI에서 사용할 안전한 구조로 변환
 */
export function toBookmarkCollectionMapDto(
  map: BookmarkCollectionMapLean,
): BookmarkCollectionMapDto {
  return {
    _id: map._id.toString(),
    userId: map.userId.toString(),
    feedItemId: map.feedItemId.toString(),
    collectionId: map.collectionId.toString(),

    createdAt: map.createdAt.toISOString(),
    updatedAt: map.updatedAt.toISOString(),
  };
}
