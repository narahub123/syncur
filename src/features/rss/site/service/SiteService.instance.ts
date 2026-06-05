import { SiteService } from "./SiteService";
import { SiteRepository } from "../repository/SiteRepository";

export const siteService = new SiteService(new SiteRepository());
