"use server";

import { connectMongo } from "@/shared/lib/db/mongoose";
import { faqService } from "../services/FaqService.instance";
import { requireAuth } from "@/shared/lib/auth/requireAuth";

export async function getPublicFaqsAction() {
  await connectMongo();

  await requireAuth();

  // '공개'된 것만 필터링해서 가져옴
  return await faqService.getAllFaq(true);
}
