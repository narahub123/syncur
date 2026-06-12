import { Types } from "mongoose";
import { NotificationLean } from "../types/notification-leans";
import { CreateNotificationDto } from "../types";
import { NotificationModel } from "../model/notification";

/**
 * Notification Repository
 *
 * Notification 컬렉션 접근 담당
 */
export class NotificationRepository {
  /**
   * 알림 생성
   */
  async create(dto: CreateNotificationDto): Promise<NotificationLean> {
    const notification = await NotificationModel.create(dto);

    return notification.toObject();
  }

  /**
   * 단일 알림 조회
   */
  async findById(id: Types.ObjectId): Promise<NotificationLean | null> {
    return NotificationModel.findById(id).lean();
  }

  /**
   * 사용자 알림 목록 조회
   *
   * 최신순 정렬
   */
  async findByUserId(
    userId: Types.ObjectId,
    limit = 20,
  ): Promise<NotificationLean[]> {
    return NotificationModel.find({
      userId,
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  }

  /**
   * 사용자 읽지 않은 알림 목록 조회
   */
  async findUnreadByUserId(
    userId: Types.ObjectId,
    limit = 20,
  ): Promise<NotificationLean[]> {
    return NotificationModel.find({
      userId,
      isRead: false,
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  }

  /**
   * 읽지 않은 알림 개수 조회
   */
  async countUnreadByUserId(userId: Types.ObjectId): Promise<number> {
    return NotificationModel.countDocuments({
      userId,
      isRead: false,
    });
  }

  /**
   * 알림 읽음 처리
   */
  async markAsRead(id: Types.ObjectId): Promise<NotificationLean | null> {
    return NotificationModel.findByIdAndUpdate(
      id,
      {
        isRead: true,
      },
      {
        new: true,
      },
    ).lean();
  }

  /**
   * 사용자 전체 알림 읽음 처리
   */
  async markAllAsRead(userId: Types.ObjectId): Promise<number> {
    const result = await NotificationModel.updateMany(
      {
        userId,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
        },
      },
    );

    return result.modifiedCount;
  }

  /**
   * 알림 삭제
   */
  async deleteById(id: Types.ObjectId): Promise<boolean> {
    const result = await NotificationModel.deleteOne({
      _id: id,
    });

    return result.deletedCount > 0;
  }
}
