"use server";

import { connectMongo } from "@/shared/lib/db/mongoose";
import { faqService } from "../services/FaqService.instance";
import { requireAuth } from "@/shared/lib/auth/requireAuth";
import { revalidatePath } from "next/cache";
import { ROUTES } from "@/shared/constants/routes";

export async function deleteFaqAction(id: string) {
  await connectMongo();
  await requireAuth();

  await faqService.deleteFaq(id);

  // 삭제 후 목록 페이지의 캐시를 갱신합니다.
  revalidatePath(ROUTES.ADMIN_FAQS);
}
