import { SiteLean } from "@/shared/types/domain-leans";
import { SiteDto } from "../dto/siteDto";

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
    feed_url: doc.feed_url,

    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
};
