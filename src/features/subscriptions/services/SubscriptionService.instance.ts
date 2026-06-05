import { SubscriptionService } from "./SubscriptionService";
import { SubscriptionRepository } from "../repository/SubscriptionRepository";

export const subscriptionService = new SubscriptionService(
  new SubscriptionRepository(),
);
