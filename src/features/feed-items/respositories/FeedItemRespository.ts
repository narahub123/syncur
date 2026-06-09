import { Types } from "mongoose";
import { FeedItemModel } from "../models/feed-item";
import { toObjectId } from "@/shared/utils/toObjectId";
import { FeedItemLean } from "@/shared/types/domain-leans";

/**
 * FeedItem Repository
 *
 * FeedItem 컬렉션에 대한 DB 접근 계층
 *
 * 특징:
 * - feedIds 기준 bulk 조회 지원
 * - lean 기반 read-only 조회
 * - 비즈니스 로직 포함 금지
 */
export class FeedItemRespository {
  /**
   * feedIds 기준 FeedItem 목록 조회
   *
   * @description
   * 여러 feed에 속한 feed item들을 bulk로 조회한다.
   * string / ObjectId 모두 허용한다.
   */
  async findByFeedIds(
    feedIds: (string | Types.ObjectId)[],
  ): Promise<FeedItemLean[]> {
    return FeedItemModel.find({
      feedId: {
        $in: feedIds.map((id) => toObjectId(id)),
      },
    }).lean();
  }
}
