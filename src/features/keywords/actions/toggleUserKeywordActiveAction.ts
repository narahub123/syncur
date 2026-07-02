"use server";

import { requireAuth } from "@/shared/lib/auth/requireAuth";
import { connectMongo } from "@/shared/lib/db/mongoose";
import { userKeywordService } from "../services/UserKeywordService.instance";

export async function toggleUserKeywordActiveAction(params: {
  userKeywordId: string;
  isActive: boolean;
}) {
  await connectMongo();

  const session = await requireAuth();

  if (!session?.user?.id) {
    throw new Error("UNAUTHORIZED");
  }

  return userKeywordService.toggleKeywordActive({
    userId: session.user.id,
    userKeywordId: params.userKeywordId,
    isActive: params.isActive,
  });
}
