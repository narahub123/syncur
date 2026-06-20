"use server";

import { requireAdmin } from "@/features/admin/lib/requireAdmin";
import { connectMongo } from "@/shared/lib/db/mongoose";
import { bugReportService } from "../services/BugReportService.instance";
import { ImageInfo } from "@/shared/lib/cloudinary/image-info.model";
import { BugReportStatus } from "../types/search";

interface ReplyBugReportParams {
  bugReportId: string;
  replyContent: string;
  status: BugReportStatus;
  images: ImageInfo[];
}

export async function replyToBugReportAction({
  bugReportId,
  replyContent,
  status,
  images,
}: ReplyBugReportParams) {
  await connectMongo();
  const session = await requireAdmin();

  return await bugReportService.replyToBugReport({
    bugReportId,
    replyContent,
    images,
    adminId: session.user.id,
    status,
  });
}
