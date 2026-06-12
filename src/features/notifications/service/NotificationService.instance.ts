import { notificationRepository } from "../repository/NotificationRepository.instance";
import { NotificationService } from "./NotificationService";

/**
 * Notification Service Singleton
 */
export const notificationService = new NotificationService(
  notificationRepository,
);
