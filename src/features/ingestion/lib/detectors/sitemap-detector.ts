import axios from "axios";
import { XMLParser } from "fast-xml-parser";
import { Logger } from "../../logger/types";

/**
 * 사이트맵 엔트리의 데이터 구조를 정의합니다.
 */
interface SitemapEntry {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
}

/**
 * XML 파싱 결과의 구조를 정의합니다.
 */
interface SitemapParsedData {
  urlset?: {
    url: SitemapEntry | SitemapEntry[];
  };
  sitemapindex?: {
    sitemap: SitemapEntry | SitemapEntry[];
  };
}

/**
 * 웹 사이트의 사이트맵(sitemap.xml)을 탐색하고 파싱하여 URL 목록을 추출하는 클래스입니다.
 * robots.txt를 우선 확인하고, 없을 경우 표준 경로를 시도합니다.
 */
export class SitemapDetector {
  private parser: XMLParser;

  /**
   * SitemapDetector 인스턴스를 생성하고 XML 파서를 초기화합니다.
   */
  constructor() {
    this.parser = new XMLParser({ ignoreAttributes: false });
  }

  /**
   * 외부에서 호출하는 유일한 메서드입니다.
   * 사이트맵 URL을 찾고, 콘텐츠를 가져온 뒤 최종적으로 URL 목록을 파싱합니다.
   * @param {string} baseUrl - 사이트맵을 탐색할 대상 도메인 또는 기준 URL
   * @returns {Promise<string[]>} 발견된 사이트맵 내의 URL 배열 (찾지 못할 경우 빈 배열 반환)
   */
  async detect(baseUrl: string, logger: Logger): Promise<string[]> {
    // 1. 사이트맵 URL 찾기 (robots.txt 포함)
    const sitemapUrl = await this.findSitemapUrl(baseUrl, logger);
    logger.info("Sitemap URL 탐색 완료", {
      sitemapUrl,
    });
    if (!sitemapUrl) {
      logger.warn("Sitemap URL 없음", {
        baseUrl,
      });
      return [];
    }

    // 2. 사이트맵 콘텐츠 가져오기
    const xmlData = await this.fetchSitemapContent(sitemapUrl, logger);

    logger.info("Sitemap fetch 완료", {
      sitemapUrl,
      hasData: !!xmlData,
    });
    if (!xmlData) {
      logger.warn("Sitemap fetch 실패", {
        sitemapUrl,
      });
      return [];
    }

    // 3. 파싱하여 URL 목록 반환
    logger.debug("Sitemap parse 시작", {
      sitemapUrl,
    });

    const result = this.parseUrls(xmlData, logger);

    logger.info("Sitemap parse 완료", {
      urlCount: result.length,
    });

    return result;
  }

  /**
   * robots.txt 또는 표준 경로를 통해 사이트맵 URL을 검색합니다.
   * @param {string} baseUrl - 탐색을 시작할 기준 URL
   * @returns {Promise<string | null>} 발견된 사이트맵 URL 또는 null
   * @private
   */
  private async findSitemapUrl(
    baseUrl: string,
    logger: Logger,
  ): Promise<string | null> {
    const domain = new URL(baseUrl).origin;

    logger.debug("robots.txt 탐색 시작", {
      domain,
    });
    // 1순위: robots.txt 확인
    try {
      const robots = await axios.get(`${domain}/robots.txt`, { timeout: 3000 });
      logger.info("robots.txt 조회 성공", {
        domain,
      });
      const match = robots.data.match(/^Sitemap:\s*(.*)$/im);
      if (match) {
        logger.info("robots.txt에서 Sitemap 발견", {
          sitemapUrl: match[1].trim(),
        });
        return match[1].trim();
      }
    } catch (e) {}

    // 2순위: 표준 경로 확인
    const candidates = [`${domain}/sitemap.xml`, `${domain}/sitemap_index.xml`];

    logger.info("표준 Sitemap 경로 탐색 시작", {
      candidates,
    });

    for (const url of candidates) {
      logger.debug("Sitemap 후보 확인", {
        url,
      });
      try {
        const res = await axios.head(url);
        if (res.status === 200) {
          logger.info("Sitemap HEAD 성공", {
            url,
            status: res.status,
          });
          return url;
        }
      } catch (e) {}
    }

    logger.warn("Sitemap URL 탐색 실패", {
      domain,
    });

    return null;
  }

  /**
   * 지정된 URL에서 사이트맵 XML 콘텐츠를 가져옵니다.
   * @param {string} url - 사이트맵 XML이 위치한 URL
   * @returns {Promise<string | null>} XML 문자열 데이터 또는 실패 시 null
   * @private
   */
  private async fetchSitemapContent(
    url: string,
    logger: Logger,
  ): Promise<string | null> {
    logger.debug("Sitemap fetch 시작", {
      url,
    });
    try {
      const res = await axios.get(url);

      logger.info("Sitemap fetch 성공", {
        url,
      });
      return res.data;
    } catch (e) {
      logger.info("Sitemap fetch 성공", {
        url,
      });
      return null;
    }
  }

  /**
   * XML 문자열을 파싱하여 사이트맵 내의 <loc> 태그에 담긴 URL들을 추출합니다.
   * 단일 사이트맵(urlset)과 사이트맵 인덱스(sitemapindex) 구조를 모두 처리합니다.
   * @param {string} xmlData - 파싱할 XML 문자열
   * @returns {string[]} 추출된 URL 주소 목록
   * @private
   */
  private parseUrls(xmlData: string, logger: Logger): string[] {
    logger.debug("Sitemap XML 파싱 시작");

    // XML 파서 결과를 SitemapParsedData 타입으로 단언하여 사용합니다.
    const json = this.parser.parse(xmlData) as SitemapParsedData;

    // urlset(단일) 또는 sitemapindex(목록형) 구조에서 항목을 가져옵니다.
    const urlEntries = json.urlset?.url ?? json.sitemapindex?.sitemap;

    logger.debug("Sitemap 구조 확인", {
      hasUrlset: !!json.urlset,
      hasIndex: !!json.sitemapindex,
    });

    if (!urlEntries) {
      logger.debug("Sitemap 구조 확인", {
        hasUrlset: !!json.urlset,
        hasIndex: !!json.sitemapindex,
      });
      return [];
    }

    // 데이터가 단일 객체인지 배열인지에 따라 처리합니다.
    const items = Array.isArray(urlEntries) ? urlEntries : [urlEntries];

    logger.info("Sitemap URL 추출 완료", {
      count: items.length,
    });

    // loc 필드를 추출하고, 유효한 문자열만 필터링합니다.
    return items
      .map((item) => item.loc)
      .filter(
        (loc): loc is string => typeof loc === "string" && loc.length > 0,
      );
  }
}
