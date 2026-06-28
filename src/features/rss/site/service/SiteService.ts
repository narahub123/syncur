import { SiteInfo } from "@/features/ingestion/lib/extractors/extractSiteInfo";
import { SiteDto } from "../dto/siteDto";
import { toSiteDto } from "../mappers/toSiteDto";
import { SiteRepository } from "../repository/SiteRepository";
import { normalizeSiteIdentity } from "../utils/normalizeSiteIdentity";
import { AdminSiteStatsService } from "@/features/admin/sites/services/AdminSiteStatsService";
import { Types } from "mongoose";
import { SiteFeedStatus } from "../types";

export class SiteService {
  private readonly siteRepository: SiteRepository;

  constructor(
    siteRepository: SiteRepository,
    private statsService: AdminSiteStatsService,
  ) {
    this.siteRepository = siteRepository;
  }

  /**
   * Site가 검색어에 매칭되는지 판단
   *
   * @param site DB에서 조회된 Site 데이터
   * @param query 사용자 입력 검색어
   *
   * @returns 검색어와 매칭되면 true
   */
  match(site: { url: string; name: string }, query: string) {
    const q = normalizeSiteIdentity(query);
    const url = normalizeSiteIdentity(site.url);
    const name = site.name.toLowerCase();

    return url.includes(q) || name.includes(q);
  }

  async findByUrl(url: string): Promise<SiteDto | null> {
    const doc = await this.siteRepository.findByUrl(url);

    if (!doc) return null;

    return toSiteDto(doc);
  }

  async createPending(url: string, siteInfo: SiteInfo): Promise<SiteDto> {
    const doc = await this.siteRepository.upsert({
      url,
      name: siteInfo.name,
      favicon_url: siteInfo.favicon_url,
      feedStatus: "pending",
    });

    return toSiteDto(doc);
  }

  async updateFeedStatus(
    siteId: string | Types.ObjectId,
    feedStatus: SiteFeedStatus,
  ): Promise<SiteDto | null> {
    const doc = await this.siteRepository.updateFeedStatus(siteId, feedStatus);

    if (!doc) return null;
    return toSiteDto(doc);
  }
}
