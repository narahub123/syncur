import { FeedDto } from "@/features/feeds/dto/feedDto";
import { SiteContextDTO, SiteDto } from "../dto/siteDto";

export type BuildRssSiteContextInput = {
  site: SiteDto;
  feed: FeedDto;
  subscriptionExists: boolean;
};

export function buildRssSiteContext(
  input: BuildRssSiteContextInput,
): SiteContextDTO {
  const { site, feed, subscriptionExists } = input;

  return {
    siteId: site._id,
    feedId: feed.id,

    url: site.url,
    name: site.name,
    favicon_url: site.favicon_url,

    feedStatus: site.feedStatus,

    isSubscribed: subscriptionExists,

    // RSS Feed가 존재하므로 항상 구독 가능 사이트
    canSubscribe: true,
  };
}
