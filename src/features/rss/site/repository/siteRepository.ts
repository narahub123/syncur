import { Site } from "@/shared/types/site";
import { SITE_SEARCH_LIMIT } from "../constants/site";
import { SiteModel } from "../model/Site";
import { CreateSiteDto } from "../dto/siteDto";

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
}
