"use server";

import { auth } from "@/auth";

import { subscriptionService } from "../services/SubscriptionService.instance";

export const getSubscriptionsAction = async (page: number, limit: number) => {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("UNAUTHORIZED");
  }

  return subscriptionService.getUserSubscriptions(session.user.id, page, limit);
};
