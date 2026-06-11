import { BookmarkCollectionLean } from "@/shared/types/domain-leans";
import { Types } from "mongoose";
import { BookmarkCollectionModel } from "../model/bookmark-collection";
import { toObjectId } from "@/shared/utils/toObjectId";

export class BookmarkCollectionRepository {
  /**
   * 컬렉션 생성
   *
   * @param userId 사용자 ID
   * @param name 컬렉션 이름
   * @param description 설명 (optional)
   */
  async create(params: {
    userId: string | Types.ObjectId;
    name: string;
    description?: string;
  }): Promise<BookmarkCollectionLean> {
    const doc = await BookmarkCollectionModel.create({
      userId: toObjectId(params.userId),
      name: params.name,
    });

    return doc.toObject();
  }

  /**
   * 단일 컬렉션 조회
   *
   * @param collectionId 컬렉션 ID
   */
  async findOne(
    collectionId: string | Types.ObjectId,
    userId: string | Types.ObjectId,
  ): Promise<BookmarkCollectionLean | null> {
    return BookmarkCollectionModel.findOne({
      _id: toObjectId(collectionId),
      userId: toObjectId(userId),
    }).lean();
  }

  /**
   * 컬렉션 이름 수정
   */
  async rename(params: {
    collectionId: string | Types.ObjectId;
    name: string;
    userId: string | Types.ObjectId;
  }): Promise<BookmarkCollectionLean | null> {
    return BookmarkCollectionModel.findByIdAndUpdate(
      {
        _id: toObjectId(params.collectionId),
        userId: toObjectId(params.userId),
      },
      { $set: { name: params.name } },
      { returnDocument: "after" },
    ).lean();
  }

  /**
   * 컬렉션 삭제
   */
  async delete(params: {
    collectionId: string | Types.ObjectId;
    userId: string | Types.ObjectId;
  }): Promise<void> {
    await BookmarkCollectionModel.deleteOne({
      _id: toObjectId(params.collectionId),
      userId: toObjectId(params.userId),
    });
  }
  /**
   * 유저의 모든 컬렉션 조회
   */
  async findAllByUserId(
    userId: Types.ObjectId | string,
  ): Promise<BookmarkCollectionLean[]> {
    return BookmarkCollectionModel.find({ userId: toObjectId(userId) })
      .sort({ createdAt: -1 })
      .lean();
  }

  async findByIds(
    collectionIds: (string | Types.ObjectId)[],
  ): Promise<BookmarkCollectionLean[]> {
    return BookmarkCollectionModel.find({
      _id: {
        $in: collectionIds.map((id) => toObjectId(id)),
      },
    }).lean();
  }

  /**
   * 유저 컬렉션 검색 + 페이지네이션 (무한스크롤)
   */
  async findByUserIdWithPaging(params: {
    userId: Types.ObjectId | string;
    keyword?: string;
    limit: number;
    cursor?: string;
  }): Promise<BookmarkCollectionLean[]> {
    const { userId, keyword, limit, cursor } = params;

    return BookmarkCollectionModel.find({
      userId: toObjectId(userId),
      ...(keyword ? { name: { $regex: keyword, $options: "i" } } : {}),
      ...(cursor ? { _id: { $lt: cursor } } : {}),
    })
      .sort({ _id: -1 })
      .limit(limit)
      .lean();
  }

  /**
   * 전체 컬렉션 검색 (관리/추천/탐색용)
   */
  async searchGlobalCollections(params: {
    keyword: string;
    limit: number;
  }): Promise<BookmarkCollectionLean[]> {
    return BookmarkCollectionModel.aggregate([
      {
        $match: {
          name: { $regex: params.keyword, $options: "i" },
        },
      },

      {
        $group: {
          _id: "$name",
          count: { $sum: 1 }, // ⭐ 핵심: 등장 횟수
          doc: { $first: "$$ROOT" },
        },
      },

      {
        $sort: {
          count: -1, // ⭐ 인기순
          "doc.createdAt": -1, // tie-breaker
        },
      },

      {
        $replaceRoot: {
          newRoot: "$doc",
        },
      },

      {
        $limit: params.limit,
      },
    ]);
  }

  /**
   * 유저 컬렉션 + 글로벌 컬렉션 검색 (페이지네이션 없음)
   *
   * - cursor 사용 안 함
   * - UI 통합 검색용
   * - limit 기반 top N 반환
   */
  async searchCollectionsUnified(params: {
    userId: Types.ObjectId | string;
    keyword: string;
    limit: number;
  }): Promise<{
    user: BookmarkCollectionLean[];
    global: BookmarkCollectionLean[];
  }> {
    const { userId, keyword, limit } = params;

    const [userResult, globalResult] = await Promise.all([
      // 사용자 컬렉션 검색
      BookmarkCollectionModel.find({
        userId: toObjectId(userId),
        name: { $regex: keyword, $options: "i" },
      })
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean(),

      // 글로벌 컬렉션 검색 (grouped ranking)
      BookmarkCollectionModel.aggregate([
        {
          $match: {
            name: { $regex: keyword, $options: "i" },
          },
        },
        {
          $group: {
            _id: "$name",
            count: { $sum: 1 },
            doc: { $first: "$$ROOT" },
          },
        },
        {
          $sort: {
            count: -1,
            "doc.createdAt": -1,
          },
        },
        {
          $replaceRoot: {
            newRoot: "$doc",
          },
        },
        {
          $limit: limit,
        },
      ]),
    ]);

    return {
      user: userResult,
      global: globalResult,
    };
  }
  /**
   * 이름으로 컬렉션 조회
   *
   * 정책:
   * - 동일 사용자 내 검색
   */
  async findByName(params: {
    userId: string | Types.ObjectId;
    name: string;
  }): Promise<BookmarkCollectionLean | null> {
    return BookmarkCollectionModel.findOne({
      userId: toObjectId(params.userId),
      name: params.name,
    }).lean();
  }
}
