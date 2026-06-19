import { SubscriptionService } from "./SubscriptionService";
import { subscriptionRepository } from "../repository/SubscriptionRepository.instance";
import { FeedService } from "@/features/feeds/service/FeedService";

export const subscriptionService = new SubscriptionService(
  subscriptionRepository,
  new FeedService(),
);
