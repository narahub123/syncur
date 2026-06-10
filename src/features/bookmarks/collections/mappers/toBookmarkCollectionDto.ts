import { BookmarkCollectionLean } from "@/shared/types/domain-leans";
import { BookmarkCollectionDto } from "../dto/bookmarkCollectionDto";

/**
 * Collection Mapper
 *
 * 역할:
 * - DB Lean → API DTO 변환
 * - 순수 데이터 변환만 담당 (비즈니스 로직 금지)
 */
export function toBookmarkCollectionDto(
  collection: BookmarkCollectionLean,
): BookmarkCollectionDto {
  return {
    _id: collection._id.toString(),
    userId: collection.userId.toString(),
    name: collection.name,

    createdAt: collection.createdAt.toISOString(),
    updatedAt: collection.updatedAt.toISOString(),
  };
}
