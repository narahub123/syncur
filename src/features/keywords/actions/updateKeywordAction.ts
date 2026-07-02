"use server";

import { requireAuth } from "@/shared/lib/auth/requireAuth";
import { connectMongo } from "@/shared/lib/db/mongoose";
import { userKeywordService } from "../services/UserKeywordService.instance";

export async function updateKeywordAction(input: {
  userKeywordId: string;
  displayKeyword: string;
  keyword: string;
  subscriptionIds: string[];
}) {
  await connectMongo();

  const session = await requireAuth();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  return userKeywordService.updateKeyword({
    userId,
    userKeywordId: input.userKeywordId,
    displayKeyword: input.displayKeyword,
    keyword: input.keyword,
    subscriptionIds: input.subscriptionIds,
  });
}
