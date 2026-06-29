import { FeedLean } from "@/features/feeds/types/leans";
import { createLogger } from "@/features/ingestion/logger/logger";
import { createTraceId } from "@/features/ingestion/logger/trace-id";
import { fetchDynamicSite, fetchSite } from "../../fetch-utils";
import { HTML_SITE_TYPE } from "../../detectors/types";

export type FetchCrawlResult =
  | {
      type: "OK";
      html: string;
      finalUrl: string;
    }
  | {
      type: "NOT_MODIFIED";
    };

export async function fetchCrawl(feed: FeedLean): Promise<FetchCrawlResult> {
  const url = feed.listingPageUrl!;
  const htmlType = feed.crawlerConfig?.htmlType ?? HTML_SITE_TYPE.STATIC;

  const logger = createLogger({ traceId: createTraceId() });

  const res =
    htmlType === HTML_SITE_TYPE.DYNAMIC
      ? await fetchDynamicSite(url, logger)
      : await fetchSite(url, logger);

  if (!res) {
    throw new Error(
      htmlType === HTML_SITE_TYPE.STATIC
        ? `CRAWL_FETCH_ERROR: ${url}`
        : `CRAWL_FETCH_DYNAMIC_ERROR: ${url}`,
    );
  }

  return {
    type: "OK",
    html: res.html,
    finalUrl: res.finalUrl,
  };
}
