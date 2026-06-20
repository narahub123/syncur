"use server";

import { bugReportService } from "@/features/admin/bug-reports/services/BugReportService.instance";
import { BugReportQuery } from "@/features/admin/bug-reports/types/search";
import { requireAdmin } from "@/features/admin/lib/requireAdmin";
import { connectMongo } from "@/shared/lib/db/mongoose";

export async function getBugReportsAction(query: BugReportQuery) {
  await connectMongo();
  await requireAdmin(); // 관리자 권한 확인

  return await bugReportService.getBugReportsForAdmin(query);
}
