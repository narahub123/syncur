"use server";

import { connectMongo } from "@/shared/lib/db/mongoose";
import { requireAuth } from "@/shared/lib/auth/requireAuth";
import { revalidatePath } from "next/cache";
import { ROUTES } from "@/shared/constants/routes";
import { adminFaqService } from "../services/AdminFaqService.instance";

export async function deleteFaqAction(id: string) {
  await connectMongo();
  await requireAuth();

  await adminFaqService.deleteFaq(id);

  // 삭제 후 목록 페이지의 캐시를 갱신합니다.
  revalidatePath(ROUTES.ADMIN_FAQS);
}
