import { Types } from "mongoose";
import { NotificationRepository } from "../repository/NotificationRepository";
import {
  NotificationDto,
  NotificationWithSiteAndFeedExecutionLogDtoPagedResponse,
} from "../dtos/notificationDto";
import { CreateNotificationDto } from "../types";
import {
  toNotificationDto,
  toNotificationDtos,
} from "../mappers/toNotificationDto";
import {
  FEED_EXECUTION_STAGE,
  FeedExecutionStage,
} from "@/features/feed-execution-logs/constants/feed-execution-log";
import { NOTIFICATION_TARGET } from "../constants/notification-target";
import { NOTIFICATION_TYPE } from "../constants/notification-type";
import { UserService } from "@/features/users/services/UserService";

import { PAGINATION } from "@/shared/constants/pagination";
import { ADMIN_CONFIG } from "@/features/admin/constants/admin-config";
import { toObjectId } from "@/shared/utils/toObjectId";
import { toNotificationWithSiteAndFeedExecutionLogDtoS } from "../mappers/toNotificationWithSiteAndFeedExecutionLogDto";
import { AdminNotificationsQuery } from "@/features/admin/notifiactions/types";

/**
 * Notification Service
 *
 * Notification 비즈니스 로직 담당
 */
export class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly userService: UserService,
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
  async markAsRead(
    id: Types.ObjectId | string,
    userId: Types.ObjectId | string,
  ): Promise<NotificationDto | null> {
    const notification = await this.notificationRepository.markAsRead(
      id,
      userId,
    );

    if (!notification) {
      return null;
    }

    return toNotificationDto(notification);
  }

  /**
   * 사용자 전체 알림 읽음 처리
   */
  async markAllAsRead(userId: Types.ObjectId | string): Promise<number> {
    return this.notificationRepository.markAllAsRead(userId);
  }

  /**
   * 알림 삭제
   */
  async deleteById(id: Types.ObjectId): Promise<boolean> {
    return this.notificationRepository.deleteById(id);
  }

  /**
   * 관리자 에러 알림 생성
   *
   * RSS 수집 과정에서 에러가 발생한 경우
   * 모든 관리자에게 알림을 전송한다.
   */
  async createAdminErrorNotification(params: {
    siteId: string;
    feedId: string;
    feedExecutionLogId: string;
    stage: FeedExecutionStage;
    errorMessage: string;
  }): Promise<void> {
    const admins = await this.userService.findAdmins();

    const title =
      params.stage === FEED_EXECUTION_STAGE.FETCH
        ? "RSS 수집 실패"
        : params.stage === FEED_EXECUTION_STAGE.PARSE
          ? "RSS 파싱 실패"
          : "RSS 저장 실패";

    const message = [
      `Feed ID: ${params.feedId}`,
      `Stage: ${params.stage}`,
      `Error: ${params.errorMessage}`,
    ].join("\n");

    await Promise.all(
      admins.map((admin) =>
        this.notificationRepository.create({
          userId: toObjectId(admin._id),

          target: NOTIFICATION_TARGET.ADMIN,

          type: NOTIFICATION_TYPE.RSS_FAILED,

          title,
          message,

          metadata: {
            feedId: toObjectId(params.feedId),
            feedExecutionLogId: toObjectId(params.feedExecutionLogId),
            siteId: toObjectId(params.siteId),
          },
        }),
      ),
    );
  }

  /**
   * 관리자 알림 목록 조회
   */
  async findAllPaginated(
    query: AdminNotificationsQuery,
  ): Promise<NotificationWithSiteAndFeedExecutionLogDtoPagedResponse> {
    const page = query.page ?? PAGINATION.DEFAULT_PAGE;
    const limit = query.limit ?? ADMIN_CONFIG.NOTIFICATIONS.PAGINATION_LIMIT;

    const { items, totalCount } =
      await this.notificationRepository.findAllPaginated(query);

    const totalPages = Math.max(Math.ceil(totalCount / limit), 0);

    return {
      items: toNotificationWithSiteAndFeedExecutionLogDtoS(items),
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
      },
    };
  }
}
