import { AdminSiteRepository } from "../repositories/AdminSiteRepository";
import { AdminSiteService } from "./AdminSiteService";

export const adminSiteService = new AdminSiteService(new AdminSiteRepository());
