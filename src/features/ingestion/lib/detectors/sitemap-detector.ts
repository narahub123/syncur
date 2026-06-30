import axios from "axios";
import { XMLParser } from "fast-xml-parser";
import { Logger } from "pino";

interface SitemapEntry {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
}

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

  constructor() {
    this.parser = new XMLParser({ ignoreAttributes: false });
  }

  detect = async (baseUrl: string, logger: Logger): Promise<string[]> => {
    const sitemapUrl = await this.findSitemapUrl(baseUrl, logger);

    if (!sitemapUrl) {
      logger.warn({ baseUrl }, "sitemap.url.not_found");
      return [];
    }

    logger.info({ baseUrl, sitemapUrl }, "sitemap.url.found");

    const xmlData = await this.fetchSitemapContent(sitemapUrl, logger);

    if (!xmlData) {
      logger.warn({ sitemapUrl }, "sitemap.fetch.failed");
      return [];
    }

    logger.info({ sitemapUrl, hasData: !!xmlData }, "sitemap.fetch.success");

    logger.debug({ sitemapUrl }, "sitemap.parse.start");

    const result = this.parseUrls(xmlData, logger);

    logger.info(
      { sitemapUrl, urlCount: result.length },
      "sitemap.parse.success",
    );

    return result;
  };

  private findSitemapUrl = async (
    baseUrl: string,
    logger: Logger,
  ): Promise<string | null> => {
    const domain = new URL(baseUrl).origin;

    logger.debug({ domain }, "sitemap.robots.lookup.start");

    // 1순위: robots.txt 확인
    try {
      const robots = await axios.get(`${domain}/robots.txt`, { timeout: 3000 });

      logger.info({ domain }, "sitemap.robots.fetch.success");

      const match = robots.data.match(/^Sitemap:\s*(.*)$/im);
      if (match) {
        const sitemapUrl = match[1].trim();

        logger.info({ domain, sitemapUrl }, "sitemap.robots.sitemap.found");

        return sitemapUrl;
      }
    } catch (e) {
      logger.debug({ domain }, "sitemap.robots.fetch.failed");
    }

    // 2순위: 표준 경로 확인
    const candidates = [`${domain}/sitemap.xml`, `${domain}/sitemap_index.xml`];

    logger.debug({ domain, candidates }, "sitemap.candidates.lookup.start");

    for (const url of candidates) {
      logger.debug({ url }, "sitemap.candidate.check");

      try {
        const res = await axios.head(url);
        if (res.status === 200) {
          logger.info({ url, status: res.status }, "sitemap.candidate.found");
          return url;
        }
      } catch (e) {
        logger.debug({ url }, "sitemap.candidate.not_found");
      }
    }

    logger.warn({ domain }, "sitemap.url.lookup.failed");

    return null;
  };

  private fetchSitemapContent = async (
    url: string,
    logger: Logger,
  ): Promise<string | null> => {
    logger.debug({ url }, "sitemap.content.fetch.start");

    try {
      const res = await axios.get(url);

      logger.info({ url }, "sitemap.content.fetch.success");

      return res.data;
    } catch (e) {
      logger.warn({ url }, "sitemap.content.fetch.failed");
      return null;
    }
  };

  private parseUrls = (xmlData: string, logger: Logger): string[] => {
    logger.debug("sitemap.parse_urls.start");

    const json = this.parser.parse(xmlData) as SitemapParsedData;

    const urlEntries = json.urlset?.url ?? json.sitemapindex?.sitemap;

    logger.debug(
      { hasUrlset: !!json.urlset, hasIndex: !!json.sitemapindex },
      "sitemap.structure.detected",
    );

    if (!urlEntries) {
      logger.debug(
        { hasUrlset: !!json.urlset, hasIndex: !!json.sitemapindex },
        "sitemap.entries.empty",
      );
      return [];
    }

    const items = Array.isArray(urlEntries) ? urlEntries : [urlEntries];

    logger.info({ count: items.length }, "sitemap.urls.extract.success");

    return items
      .map((item) => item.loc)
      .filter(
        (loc): loc is string => typeof loc === "string" && loc.length > 0,
      );
  };
}
