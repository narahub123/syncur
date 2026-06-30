import {
  SiteContextDTO,
  SiteDto,
  SubscribedListingPageDto,
} from "../dto/siteDto";

export type BuildCrawlSiteContextInput = {
  site: SiteDto;
  listingPageCount: number;
  subscriptionExists: boolean;
  subscribedListingPages?: SubscribedListingPageDto[];
};

export function buildCrawlSiteContext(
  input: BuildCrawlSiteContextInput,
): SiteContextDTO {
  const { site, listingPageCount, subscriptionExists, subscribedListingPages } =
    input;

  return {
    siteId: site._id,

    // Crawl은 여러 Feed를 가지므로 대표 Feed는 없다.
    feedId: undefined,

    url: site.url,
    name: site.name,
    favicon_url: site.favicon_url,

    feedStatus: site.feedStatus,

    listingPageCount,

    subscribedListingPages,

    // Feed 하나 이상을 구독 중인지
    isSubscribed: subscriptionExists,

    // Crawl 가능한 사이트라면 항상 구독 가능
    canSubscribe: true,
  };
}
