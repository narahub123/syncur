import { subscriptionService } from "@/features/subscriptions/services/SubscriptionService.instance";
import { notificationRepository } from "../repository/NotificationRepository.instance";
import { NotificationService } from "./NotificationService";
import { userService } from "@/features/users/services/UserService.instance";

/**
 * Notification Service Singleton
 */
export const notificationService = new NotificationService(
  notificationRepository,
  userService,
  subscriptionService,
);
