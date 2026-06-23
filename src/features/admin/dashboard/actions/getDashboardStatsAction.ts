"use server";

import { requireAdmin } from "@/features/admin/lib/requireAdmin";
import { connectMongo } from "@/shared/lib/db/mongoose";
import { adminDashboardService } from "../service/AdminDashboardService.instance";

export async function getDashboardStatsAction() {
  await connectMongo();
  await requireAdmin();

  return await adminDashboardService.getDashboardStats();
}
