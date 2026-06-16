"use server";

import { connectMongo } from "@/shared/lib/db/mongoose";
import { requireAuth } from "@/shared/lib/auth/requireAuth";
import { requestService } from "../services/RequestService.instance";
import { USER_ROLE } from "@/features/users/constants/user-role";

export async function getRequestDetailAction(requestId: string) {
  await connectMongo();
  const session = await requireAuth();

  const request = await requestService.getRequestById(requestId);

  // 본인 확인: 시스템 관리자가 아닌 경우 본인 문의만 조회 가능
  if (
    request.userId !== session.user.id &&
    session.user.role !== USER_ROLE.ADMIN
  ) {
    throw new Error("접근 권한이 없습니다.");
  }

  return request;
}
