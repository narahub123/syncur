import { SiteDto } from "../dto/siteDto";
import { SiteLean } from "../types/leans";

/**
 * SiteLean → SiteDto 변환
 *
 * @description
 * MongoDB ObjectId / Date → Client-safe string 변환
 */
export const toSiteDto = (doc: SiteLean): SiteDto => {
  return {
    _id: doc._id.toString(),

    url: doc.url,
    name: doc.name,

    favicon_url: doc.favicon_url,
    feedStatus: doc.feedStatus,

    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
};

export const toSiteDtos = (docs: SiteLean[]) => docs.map(toSiteDto);
