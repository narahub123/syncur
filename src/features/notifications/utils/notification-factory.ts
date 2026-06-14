import { NotificationMessageDTO } from "../dtos/notificationDto";

export function createNotificationMessage(
  input: Omit<NotificationMessageDTO, "id" | "createdAt">,
): NotificationMessageDTO {
  return {
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    ...input,
  };
}
