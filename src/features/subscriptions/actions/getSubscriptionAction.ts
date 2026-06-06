"use server";

import { auth } from "@/auth";

import { subscriptionService } from "../services/SubscriptionService.instance";

export const getSubscriptionsAction = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("UNAUTHORIZED");
  }

  return await subscriptionService.getUserSubscriptions(session.user.id);
};
