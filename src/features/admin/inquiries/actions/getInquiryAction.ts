"use server";

import { requireAdmin } from "@/features/admin/lib/requireAdmin";
import { connectMongo } from "@/shared/lib/db/mongoose";
import { inquiryService } from "../services/InquiryService.instance";

export async function getInquiryAction(inquiryId: string) {
  await connectMongo();
  await requireAdmin();

  return await inquiryService.getInquiryByIdForAdmin(inquiryId);
}
