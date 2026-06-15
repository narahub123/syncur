"use server";

import { requireAuth } from "@/shared/lib/auth/requireAuth";
import { connectMongo } from "@/shared/lib/db/mongoose";
import { faqService } from "../services/FaqService.instance";
import { UpdateFaqDto } from "../dtos";

/**
 * 어드민 전용 FAQ 수정 Action
 */
export async function updateFaqAction(id: string, dto: UpdateFaqDto) {
  await connectMongo();
  await requireAuth(); // 권한 체크

  return await faqService.updateFaq(id, dto);
}
