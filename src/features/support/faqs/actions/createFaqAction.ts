"use server";

import { requireAuth } from "@/shared/lib/auth/requireAuth";
import { connectMongo } from "@/shared/lib/db/mongoose";
import { CreateFaqDto } from "../dtos";
import { faqService } from "../services/FaqService.instance";

/**
 * 어드민 전용 FAQ 생성 Action
 */
export async function createFaqAction(dto: CreateFaqDto) {
  await connectMongo();

  // 어드민 세션 및 권한 가드
  const session = await requireAuth();

  // 생성자 ID를 주입하거나 비즈니스 레이어에 위임하여 처리
  return await faqService.createFaq(session.user.id, dto);
}
