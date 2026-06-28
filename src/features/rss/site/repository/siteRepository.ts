import { SITE_SEARCH_LIMIT } from "../constants/site";
import { SiteModel } from "../model/Site";
import { escapeRegExp } from "@/shared/utils/regex";
import { SiteDiscoveryResult } from "../../discovery";
import { Types } from "mongoose";
import { SiteLean } from "../types/leans";
import { SiteFeedStatus } from "../types";
import { toObjectId } from "@/shared/utils/toObjectId";

/**
 * Site Repository
 *
 * - Site 도메인에 대한 DB 접근 계층
 * - Mongoose Model을 직접 다루며, 순수 데이터 조회 책임만 가짐
 * - 비즈니스 로직(검색/필터링/가공)은 포함하지 않음
 */
export class SiteRepository {
  constructor() {}

  /**
   * Site 목록 조회
   *
   * @param limit 조회할 최대 개수 (기본값: SITE_SEARCH_LIMIT)
   *
   * @returns Site 도메인 리스트 (lean object)
   *
   * @description
   * - DB에서 Site 데이터를 최대 limit 개수만큼 조회
   * - lean()을 사용하여 Mongoose Document 오버헤드 제거
   * - 검색/필터링 로직은 Service 계층에서 처리
   */
  async findAll(limit = SITE_SEARCH_LIMIT): Promise<SiteLean[]> {
    return SiteModel.find().limit(limit).lean();
  }

  /**
   * URL 기준 Site 조회
   */
  async findByUrl(url: string): Promise<SiteLean | null> {
    return SiteModel.findOne({ url }).lean();
  }

  async updateFeedStatus(
    siteId: string | Types.ObjectId,
    feedStatus: SiteFeedStatus,
  ): Promise<SiteLean | null> {
    return await SiteModel.findByIdAndUpdate(
      toObjectId(siteId),
      { $set: { feedStatus } },
      { returnDocument: "after" },
    ).lean();
  }

  /**
   * normalizedUrl 기준으로 site 후보 검색
   * (debounce 기반 검색 대응 → 여러 결과 가능)
   */
  async search(normalizedUrl: string): Promise<SiteLean[]> {
    return SiteModel.find({
      url: {
        $regex: escapeRegExp(normalizedUrl),
        $options: "i",
      },
    }).lean();
  }

  /**
   * Site upsert (create or update)
   *
   * @param discovered - RSS discovery 결과
   */
  async upsert(discovered: SiteDiscoveryResult): Promise<SiteLean> {
    const { url, name, favicon_url, feedStatus } = discovered;

    return await SiteModel.findOneAndUpdate(
      { url },

      {
        $set: {
          url,
          name,
          favicon_url,
          feedStatus,
        },
      },

      {
        upsert: true,
        returnDocument: "after",
      },
    ).lean();
  }

  /**
   * 여러 siteId로 Site 목록 조회
   * - subscription join 최적화용
   * - IN query 기반 batch fetch
   */

  async findByIds(siteIds: string[]): Promise<SiteLean[]> {
    if (!siteIds.length) return [];

    const objectIds = siteIds.map((id) => new Types.ObjectId(id));

    return SiteModel.find({
      _id: { $in: objectIds },
    });
  }

  /**
   * FeedId 배열로 Site 조회
   *
   * @param sitedIds Feed ObjectId 문자열 배열
   *
   * @returns Site 목록
   */
  async findBySiteIds(siteIds: Types.ObjectId[]): Promise<SiteLean[]> {
    return SiteModel.find({
      _id: { $in: siteIds },
    }).lean();
  }
}
