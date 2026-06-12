import { Types } from "mongoose";

/**
 * Notification 읽음 처리 DTO
 */
export interface UpdateNotificationReadDto {
  /**
   * 알림 ID
   */
  notificationId: Types.ObjectId;

  /**
   * 읽음 여부
   */
  isRead: boolean;
}
