import { Types } from "mongoose";
import { NotificationRepository } from "../repository/NotificationRepository";
import { NotificationDto } from "../dtos/notificationDto";
import { CreateNotificationDto } from "../types";
import {
  toNotificationDto,
  toNotificationDtos,
} from "../mappers/toNotificationDto";

/**
 * Notification Service
 *
 * Notification 비즈니스 로직 담당
 */
export class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  /**
   * 알림 생성
   */
  async create(dto: CreateNotificationDto): Promise<NotificationDto> {
    const notification = await this.notificationRepository.create(dto);

    return toNotificationDto(notification);
  }

  /**
   * 단일 알림 조회
   */
  async findById(id: Types.ObjectId): Promise<NotificationDto | null> {
    const notification = await this.notificationRepository.findById(id);

    if (!notification) {
      return null;
    }

    return toNotificationDto(notification);
  }

  /**
   * 사용자 알림 목록 조회
   */
  async findByUserId(
    userId: Types.ObjectId,
    limit = 20,
  ): Promise<NotificationDto[]> {
    const notifications = await this.notificationRepository.findByUserId(
      userId,
      limit,
    );

    return toNotificationDtos(notifications);
  }

  /**
   * 사용자 읽지 않은 알림 목록 조회
   */
  async findUnreadByUserId(
    userId: Types.ObjectId,
    limit = 20,
  ): Promise<NotificationDto[]> {
    const notifications = await this.notificationRepository.findUnreadByUserId(
      userId,
      limit,
    );

    return toNotificationDtos(notifications);
  }

  /**
   * 읽지 않은 알림 개수 조회
   */
  async countUnreadByUserId(userId: Types.ObjectId): Promise<number> {
    return this.notificationRepository.countUnreadByUserId(userId);
  }

  /**
   * 알림 읽음 처리
   */
  async markAsRead(id: Types.ObjectId): Promise<NotificationDto | null> {
    const notification = await this.notificationRepository.markAsRead(id);

    if (!notification) {
      return null;
    }

    return toNotificationDto(notification);
  }

  /**
   * 사용자 전체 알림 읽음 처리
   */
  async markAllAsRead(userId: Types.ObjectId): Promise<number> {
    return this.notificationRepository.markAllAsRead(userId);
  }

  /**
   * 알림 삭제
   */
  async deleteById(id: Types.ObjectId): Promise<boolean> {
    return this.notificationRepository.deleteById(id);
  }
}
