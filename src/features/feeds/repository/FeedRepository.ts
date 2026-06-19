import { FeedModel } from "../model/feed";
import { Types } from "mongoose";
import { toObjectId } from "@/shared/utils/toObjectId";
import {
  FeedWithSiteLean,
  FeedWithSiteLeanPagedResponse,
} from "../dto/feedDto";

import { SortOrder } from "@/shared/types/pagination";
import { FeedStatus } from "@/shared/types/feed";
import {
  AdminFeedSearchField,
  AdminFeedSort,
} from "@/features/admin/feeds/types/search";
import { FeedLean } from "../types/leans";

/**
 * FeedRepository
 *
 * - Feed 컬렉션에 대한 DB 접근 계층
 * - 순수 CRUD만 담당 (비즈니스 로직 금지)
 *
 * 역할:
 * - Feed 조회
 * - Feed 생성
 * - Feed 업데이트/삭제 (추후 확장)
 *
 * NOTE:
 * - Site ↔ Feed 연결 로직은 Service 계층에서 처리
 */
export class FeedRepository {
  /**
   * siteId 기준으로 Feed 조회
   *
   * @param siteId - Site ObjectId
   *
   * @returns 해당 Site에 연결된 Feed (1:1 구조)
   *
   * 특징:
   * - Site당 Feed는 1개만 존재하도록 설계됨
   * - 없으면 null 반환
   */

  async findBySiteId(
    siteId: string | Types.ObjectId,
  ): Promise<FeedLean | null> {
    return await FeedModel.findOne({ siteId: toObjectId(siteId) })
      .lean()
      .exec();
  }

  /**
   * Feed 생성
   *
   * @param data
   * - siteId: 연결된 Site ObjectId
   * - feedUrl: 실제 RSS/Atom URL
   * - status: Feed 상태 (기본 active)
   * - errorCount: 실패 횟수 초기값
   * - categories: Feed 전체 분류 태그
   *
   * @returns 생성된 Feed Document
   *
   * 특징:
   * - Service 계층에서 호출되어야 함
   * - idempotency 보장은 Repository가 아닌 Service 책임
   */
  async create(data: {
    siteId: string | Types.ObjectId;
    feedUrl: string;
    status?: "active" | "error" | "disabled";
    errorCount?: number;
    categories?: string[];
  }): Promise<FeedLean | null> {
    const doc = await FeedModel.create({
      siteId: toObjectId(data.siteId),
      feedUrl: data.feedUrl,
      status: data.status ?? "active",
      errorCount: data.errorCount ?? 0,
      categories: data.categories ?? [],
    });

    return doc.toObject();
  }

  /**
   * 여러 Feed ID로 Feed 목록 조회
   *
   * @description
   * Subscription → Feed → Site 흐름에서
   * Feed를 batch로 가져오기 위한 메서드
   *
   * @param feedIds Feed ObjectId 문자열 배열
   *
   * @returns Feed 목록
   */
  async findByIds(feedIds: string[] | Types.ObjectId[]): Promise<FeedLean[]> {
    return FeedModel.find({
      _id: { $in: feedIds.map((id) => toObjectId(id)) },
    }).lean();
  }

  /**
   * Feed 목록 조회 (페이지네이션 + 검색)
   *
   */
  async findAllPaginated(params: {
    page: number;
    limit: number;
    search?: string;
    searchField?: AdminFeedSearchField;
    sort?: AdminFeedSort;
    sortOrder?: SortOrder;
  }): Promise<FeedWithSiteLeanPagedResponse> {
    const {
      page,
      limit,
      search,
      searchField = "siteName",
      sort = "siteName",
      sortOrder = "desc",
    } = params;

    const skip = (page - 1) * limit;

    const searchMap = {
      siteName: "site.name",
      siteUrl: "site.url",
      status: "status",
      category: "categories",
    } as const;

    const mongoOrder = sortOrder === "asc" ? 1 : -1;

    const sortMap = {
      siteName: { "site.name": mongoOrder },
      feedUrl: { feedUrl: mongoOrder },
      subscriberCount: { subscriberCount: mongoOrder },
      status: { status: mongoOrder },
      errorCount: { errorCount: mongoOrder },
      lastFetchedAt: { lastFetchedAt: mongoOrder },
      createdAt: { createdAt: mongoOrder },
    } as const;

    const matchStage =
      search && search.trim().length > 0
        ? {
            [searchMap[searchField]]: {
              $regex: search,
              $options: "i",
            },
          }
        : {};

    const basePipeline = [
      {
        $lookup: {
          from: "sites",
          localField: "siteId",
          foreignField: "_id",
          as: "site",
        },
      },
      {
        $unwind: "$site",
      },
      {
        $match: matchStage,
      },
    ];

    const [items, countResult] = await Promise.all([
      FeedModel.aggregate<FeedWithSiteLean>([
        ...basePipeline,
        {
          $sort: sortMap[sort],
        },
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
        {
          $project: {
            _id: 1,
            feedUrl: 1,
            status: 1,
            lastFetchedAt: 1,
            etag: 1,
            lastModified: 1,
            errorCount: 1,
            categories: 1,
            subscriberCount: 1,
            createdAt: 1,
            updatedAt: 1,
            siteId: {
              _id: "$site._id",
              name: "$site.name",
              url: "$site.url",
              favicon_url: "$site.favicon_url",
              feed_url: "$site.feed_url",
            },
          },
        },
      ]),

      FeedModel.aggregate([
        ...basePipeline,
        {
          $count: "totalCount",
        },
      ]),
    ]);

    return {
      items,
      totalCount: countResult[0]?.totalCount ?? 0,
    };
  }

  async updateStatus(feedId: string, status: FeedStatus): Promise<FeedLean> {
    return FeedModel.findByIdAndUpdate(
      feedId,
      { status },
      { returnDocument: "after" },
    ).lean();
  }

  async updateErrorCount(
    feedId: string,
    errorCount: number,
  ): Promise<FeedLean> {
    return FeedModel.findByIdAndUpdate(
      feedId,
      { errorCount },
      { returnDocument: "after" },
    ).lean();
  }

  /**
   * ingestion 대상 feed 조회
   *
   * 조건:
   * - active 상태
   * - error threshold 미만
   * - lastFetchedAt 기준 throttle 적용
   */
  async findIngestionTargets(params: {
    errorThreshold: number;
    fetchIntervalMs: number;
  }): Promise<FeedLean[]> {
    const { errorThreshold, fetchIntervalMs } = params;

    return FeedModel.find({
      status: "active",
      errorCount: { $lt: errorThreshold },
      $or: [
        { lastFetchedAt: null },
        {
          lastFetchedAt: {
            $lt: new Date(Date.now() - fetchIntervalMs),
          },
        },
      ],
    }).sort({ lastFetchedAt: 1 });
  }

  /**
   * ingestion 성공 시 feed 상태 업데이트
   *
   * 역할:
   * - lastFetchedAt 갱신
   * - errorCount 초기화
   * - etag / lastModified 저장
   */
  async markIngestionSuccess(params: {
    feedId: string;
    etag?: string;
    lastModified?: string;
  }) {
    const { feedId, etag, lastModified } = params;

    return FeedModel.updateOne(
      { _id: feedId },
      {
        $set: {
          lastFetchedAt: new Date(),
          errorCount: 0,

          ...(etag && { etag }),
          ...(lastModified && { lastModified }),
        },
      },
    );
  }

  /**
   * ingestion 실패 시 errorCount 증가
   */
  async incrementErrorCount(feedId: string) {
    return FeedModel.findByIdAndUpdate(
      feedId,
      {
        $inc: { errorCount: 1 },
      },
      { returnDocument: "after" },
    );
  }

  /**
   * error threshold 초과 시 feed disable 처리
   */
  async disableFeed(feedId: string) {
    return FeedModel.updateOne(
      { _id: feedId },
      {
        $set: {
          status: "disabled",
        },
      },
    );
  }

  /**
   * feed 단건 조회 (필요 시)
   */
  async findById(feedId: string) {
    return FeedModel.findById(feedId);
  }

  /**
   * 구독자 수 증가 (구독 시)
   */
  async incrementSubscriberCount(
    feedId: string | Types.ObjectId,
  ): Promise<FeedLean> {
    return FeedModel.findByIdAndUpdate(
      feedId,
      {
        $inc: { subscriberCount: 1 },
      },
      {
        returnDocument: "after",
      },
    ).lean();
  }

  /**
   * 구독자 수 감소 (해지 시)
   */
  async decrementSubscriberCount(
    feedId: string | Types.ObjectId,
  ): Promise<FeedLean> {
    return FeedModel.findByIdAndUpdate(
      feedId,
      {
        $inc: { subscriberCount: -1 },
      },
      {
        returnDocument: "after",
      },
    ).lean();
  }
}
