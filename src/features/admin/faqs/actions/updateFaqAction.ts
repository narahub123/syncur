"use server";

import { requireAuth } from "@/shared/lib/auth/requireAuth";
import { connectMongo } from "@/shared/lib/db/mongoose";
import { UpdateFaqDto } from "../../../support/faqs/dtos";
import { adminFaqService } from "../services/AdminFaqService.instance";

/**
 * 어드민 전용 FAQ 수정 Action
 */
export async function updateFaqAction(id: string, dto: UpdateFaqDto) {
  await connectMongo();
  await requireAuth(); // 권한 체크

  return await adminFaqService.updateFaq(id, dto);
}
