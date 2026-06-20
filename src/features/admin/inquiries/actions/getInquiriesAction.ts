"use server";

import { inquiryService } from "@/features/admin/inquiries/services/InquiryService.instance";
import { InquiryQuery } from "@/features/admin/inquiries/types/search";
import { requireAdmin } from "@/features/admin/lib/requireAdmin";
import { connectMongo } from "@/shared/lib/db/mongoose";

export async function getInquiriesAction(query: InquiryQuery) {
  await connectMongo();
  await requireAdmin(); // 관리자 권한 확인

  return await inquiryService.getInquiriesForAdmin(query);
}
