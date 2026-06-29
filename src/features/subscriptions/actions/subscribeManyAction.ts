"use server";

import { requireAuth } from "@/shared/lib/auth/requireAuth";
import { subscriptionService } from "../services/SubscriptionService.instance";

export async function subscribeManyAction(feedIds: string[]) {
  try {
    const session = await requireAuth();

    if (!session?.user?.id) {
      throw new Error("UNAUTHORIZED");
    }

    const userId = session.user.id;

    const result = await subscriptionService.subscribeMany(userId, feedIds);

    if (!result.success) {
      return { success: false };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("구독 bulk 액션 실패", error);
    return { success: false };
  }
}
