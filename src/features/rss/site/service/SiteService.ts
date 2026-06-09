import { CreateSiteDto, SiteDto } from "../dto/siteDto";
import { SiteRepository } from "../repository/SiteRepository";
import { normalizeSiteIdentity } from "../utils/normalizeSiteIdentity";
import { toSiteDto } from "../mappers/toSiteDto";

export class SiteService {
  private readonly siteRepository: SiteRepository;

  constructor(siteRepository: SiteRepository) {
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

  /**
   * Site 생성
   *
   * @description
   * 추출이 완료된 Site 정보를 저장한다.
   *
   * 동일 URL Site가 이미 존재하면
   * 기존 Site를 반환하고 새로 생성하지 않는다.
   *
   * @param siteData 저장할 Site 정보
   *
   * @returns
   * - 기존 Site
   * - 또는 새로 생성된 Site
   *
   * @note
   * RSS 탐색(discovery)은 수행하지 않는다.
   * create는 전달받은 Site 데이터만 저장한다.
   */
  async create(siteData: CreateSiteDto): Promise<SiteDto> {
    const existingSite = await this.siteRepository.findByUrl(siteData.url);

    if (existingSite) {
      return toSiteDto(existingSite);
    }

    return toSiteDto(await this.siteRepository.create(siteData));
  }
}
