"use server";

import { requireAdmin } from "@/features/admin/lib/requireAdmin";
import { connectMongo } from "@/shared/lib/db/mongoose";
import { bugReportService } from "../services/BugReportService.instance";

export async function getBugReportAction(bugReportId: string) {
  await connectMongo();
  await requireAdmin();

  return await bugReportService.getBugReportByIdForAdmin(bugReportId);
}
