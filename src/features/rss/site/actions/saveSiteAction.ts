"use server";

import { CreateSiteDto } from "../dto/siteDto";
import { siteService } from "../service/SiteService.instance";

export async function saveSiteAction(siteData: CreateSiteDto) {
  return siteService.create(siteData);
}
