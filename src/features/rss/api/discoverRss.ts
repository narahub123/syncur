import { SITE_FEED_STATUS } from "../site/constants/site";
import { CreateSiteDto } from "../site/dto/siteDto";

export type FeedDiscoveryResult =
  | { type: "found"; site: CreateSiteDto }
  | { type: "not_supported"; site: CreateSiteDto };

export async function discoverRSS(url: string): Promise<FeedDiscoveryResult> {
  // crawler / fetch / parse
  const res = await fetch(`/api/rss/discover`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
  });

  const data = await res.json();

  if (data.data.feedStatus !== SITE_FEED_STATUS.UNAVAILABLE) {
    return {
      type: "found",
      site: data.data,
    };
  }

  return {
    type: "not_supported",
    site: data.data,
  };
}
