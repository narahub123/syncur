import { FeedLean } from "@/features/feeds/types/leans";
import { fetchDynamicSite, fetchSite } from "../../fetch-utils";
import { HTML_SITE_TYPE } from "../../detectors/types";
import { Logger } from "pino";

export type FetchCrawlResult =
  | {
      type: "OK";
      html: string;
      finalUrl: string;
    }
  | {
      type: "NOT_MODIFIED";
    };

export async function fetchCrawl(
  feed: FeedLean,
  logger: Logger,
): Promise<FetchCrawlResult> {
  const url = feed.listingPageUrl!;
  const htmlType = feed.crawlerConfig?.htmlType ?? HTML_SITE_TYPE.STATIC;

  logger.info(
    {
      url,
      htmlType,
      feedId: feed._id.toString(),
    },
    "crawl.fetch.start",
  );

  const res =
    htmlType === HTML_SITE_TYPE.DYNAMIC
      ? await fetchDynamicSite(url, logger)
      : await fetchSite(url, logger);

  if (!res) {
    logger.error(
      {
        url,
        htmlType,
      },
      "crawl.fetch.failed",
    );

    throw new Error(
      htmlType === HTML_SITE_TYPE.STATIC
        ? `CRAWL_FETCH_ERROR: ${url}`
        : `CRAWL_FETCH_DYNAMIC_ERROR: ${url}`,
    );
  }

  logger.info(
    {
      url,
      finalUrl: res.finalUrl,
      htmlLength: res.html?.length ?? 0,
    },
    "crawl.fetch.success",
  );

  return {
    type: "OK",
    html: res.html,
    finalUrl: res.finalUrl,
  };
}
