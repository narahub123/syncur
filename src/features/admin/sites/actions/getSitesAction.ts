"use server";

import { AdminSiteQuery } from "@/features/admin/sites/types/search";
import { adminSiteService } from "../services/AdminSiteService.instance";
import { connectMongo } from "@/shared/lib/db/mongoose";
import { requireAdmin } from "@/features/admin/lib/requireAdmin";

export async function getSitesAction(query: AdminSiteQuery) {
  try {
    await connectMongo();

    await requireAdmin();

    return await adminSiteService.getSites(query);
  } catch (error) {
    console.error("Server Action Error:", error);
    return {
      items: [],
      pagination: {
        page: query.page,
        limit: query.limit,
        totalCount: 0,
        totalPages: 0,
      },
      error: "사이트 목록을 불러올 수 없습니다.",
    };
  }
}
