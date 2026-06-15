"use server";

import { connectMongo } from "@/shared/lib/db/mongoose";
import { faqService } from "../services/FaqService.instance";
import { requireAuth } from "@/shared/lib/auth/requireAuth";
import { FaqCategory, FaqFormValues } from "@/features/admin/faqs/types";

/**
 * FAQ 상세 조회 Action
 */
export async function getFaqAction(id: string): Promise<FaqFormValues | null> {
  await connectMongo();
  await requireAuth();

  const faq = await faqService.getFaqById(id);
  return {
    id: faq._id,
    userId: faq.userId,
    category: faq.category as FaqCategory, // 💡 강제로 타입 캐스팅
    question: faq.question,
    answer: faq.answer,
    sortOrder: faq.sortOrder.toString(), // 폼은 string을 기대하므로 맞춰줍니다
    isPublished: faq.isPublished ? "공개" : "비공개", // Boolean -> "공개"|"비공개" 변환
    createdAt: faq.createdAt,
  };
}
