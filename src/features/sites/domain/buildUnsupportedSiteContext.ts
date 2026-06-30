import { SiteContextDTO, SiteDto } from "../dto/siteDto";

export type BuildUnsupportedSiteContextInput = {
  site: SiteDto;
};

export function buildUnsupportedSiteContext(
  input: BuildUnsupportedSiteContextInput,
): SiteContextDTO {
  const { site } = input;

  return {
    siteId: site._id,

    feedId: undefined,

    url: site.url,
    name: site.name,
    favicon_url: site.favicon_url,

    feedStatus: site.feedStatus,

    listingPageCount: undefined,

    isSubscribed: false,

    canSubscribe: false,
  };
}
