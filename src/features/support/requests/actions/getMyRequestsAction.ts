"use server";

import { connectMongo } from "@/shared/lib/db/mongoose";
import { requireAuth } from "@/shared/lib/auth/requireAuth";
import { requestService } from "../services/RequestService.instance";
import { UserRequestQuery } from "../types/search";

export async function getMyRequestsAction(query: UserRequestQuery) {
  await connectMongo();

  const session = await requireAuth(); // 세션 정보를 가져오는 로직

  // userId를 여기서 주입하여 서비스 호출
  return await requestService.getMyRequestsPaginated(session.user.id, query);
}
