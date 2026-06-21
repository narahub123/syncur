import { subscriptionService } from "@/features/subscriptions/services/SubscriptionService.instance";
import { adminUserRepository } from "../repositories/AdminUserRepository.instance";
import { AdminUserService } from "./AdminUserService";
import { userStatsService } from "./UserStatsService.instance";

export const adminUserService = new AdminUserService(
  adminUserRepository,
  userStatsService,
  subscriptionService,
);
