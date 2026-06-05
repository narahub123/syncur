import { Site } from "@/shared/types/site";
import { SITE_SEARCH_LIMIT } from "../constants/site";
import { SiteModel } from "../model/Site";
import { CreateSiteDto } from "../dto/siteDto";
import { escapeRegExp } from "@/shared/utils/regex";
import { SiteDiscoveryResult } from "../../discovery";

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
  async findAll(limit = SITE_SEARCH_LIMIT): Promise<Site[]> {
    return SiteModel.find().limit(limit).lean();
  }

  /**
   * URL 기준 Site 조회
   */
  async findByUrl(url: string): Promise<Site | null> {
    return SiteModel.findOne({ url }).lean();
  }

  /**
   * Site 생성
   */
  async create(data: CreateSiteDto): Promise<Site> {
    const doc = await SiteModel.create(data);
    return doc.toObject();
  }

  /**
   * normalizedUrl 기준으로 site 후보 검색
   * (debounce 기반 검색 대응 → 여러 결과 가능)
   */
  async search(normalizedUrl: string): Promise<Site[]> {
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
  async upsert(discovered: SiteDiscoveryResult): Promise<Site> {
    const { url, name, favicon_url, feed_url } = discovered;

    /**
     * 핵심 기준:
     * - url (normalizedUrl) 기준으로 unique 처리
     */
    return await SiteModel.findOneAndUpdate(
      { url }, // match condition

      /**
       * update payload
       * - discovery 결과를 그대로 반영
       */
      {
        $set: {
          url,
          name,
          favicon_url,
          feed_url,
        },
      },

      /**
       * options
       *
       * upsert: true
       * - 없으면 생성
       * - 있으면 업데이트
       *
       * returnDocument: "after"
       * - 업데이트된 최신 document 반환
       */
      {
        upsert: true,
        returnDocument: "after",
      },
    );
  }
}
