import { Types } from "mongoose";
import { NotificationRepository } from "../repository/NotificationRepository";
import {
  NotificationDto,
  NotificationWithSiteAndFeedExecutionLogDto,
  NotificationWithSiteAndFeedExecutionLogDtoPagedResponse,
} from "../dtos/notificationDto";
import { CreateNotificationDto } from "../types";
import {
  toNotificationDto,
  toNotificationDtos,
} from "../mappers/toNotificationDto";
import {
  NOTIFICATION_TARGET,
  NotificationTarget,
} from "../constants/notification-target";
import {
  NOTIFICATION_TYPE,
  NotificationType,
} from "../constants/notification-type";
import { UserService } from "@/features/users/services/UserService";

import { PAGINATION } from "@/shared/constants/pagination";
import { ADMIN_CONFIG } from "@/features/admin/constants/admin-config";
import { toObjectId } from "@/shared/utils/toObjectId";
import {
  toNotificationWithSiteAndFeedExecutionLogDto,
  toNotificationWithSiteAndFeedExecutionLogDtoS,
} from "../mappers/toNotificationWithSiteAndFeedExecutionLogDto";
import { AdminNotificationsQuery } from "@/features/admin/notifiactions/types";
import { notFound } from "next/navigation";
import { SubscriptionService } from "@/features/subscriptions/services/SubscriptionService";
import { API_ROUTES } from "@/shared/sse/sse-api-routes";
import {
  sendBulkSseNotifications,
  sendSseNotification,
} from "@/shared/api/sse-client";
import {
  FEED_EXECUTION_STAGE,
  FeedExecutionStage,
} from "@/features/admin/logs/types/search";

/**
 * Notification Service
 *
 * Notification 비즈니스 로직 담당
 */
export class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly userService: UserService,
    private readonly subscriptionService: SubscriptionService,
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
  async countUnreadByUserId(
    userId: Types.ObjectId | string,
    target: NotificationTarget,
  ): Promise<number> {
    return this.notificationRepository.countUnreadByUserId(userId, target);
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
  async markAllAsRead(
    userId: Types.ObjectId | string,
    target: NotificationTarget,
  ): Promise<number> {
    return this.notificationRepository.markAllAsRead(userId, target);
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
    /**
     * 1. 관리자 목록 조회
     */
    const admins = await this.userService.findAdmins();

    /**
     * 2. 관리자 없음
     */
    if (!admins.length) return;

    /**
     * 3. 제목 생성 (stage 기반)
     */
    const title =
      params.stage === FEED_EXECUTION_STAGE.FETCH
        ? "RSS 수집 실패"
        : params.stage === FEED_EXECUTION_STAGE.PARSE
          ? "RSS 파싱 실패"
          : "RSS 저장 실패";

    /**
     * 4. 메시지 생성
     */
    const message = [
      `Feed ID: ${params.feedId}`,
      `Stage: ${params.stage}`,
      `Error: ${params.errorMessage}`,
    ].join("\n");

    /**
     * 5. DB 저장용 데이터 생성
     */
    const notifications = admins.map((admin) => ({
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
    }));

    /**
     * 6. DB 저장
     */
    const savedNotifications =
      await this.notificationRepository.createMany(notifications);

    /**
     * 7. SSE 브로드캐스트 (완전히 분리)
     *    → Promise.all 없이 순차 처리 (안정성 목적)
     */
    /**
     * 7. SSE 브로드캐스트 (내부 API 브릿지 호출 방식으로 전면 교체)
     */
    /**
     * 6. SSE 브로드캐스트 (최종 마스터 정제 버전)
     */
    /**
     * 7. SSE 브로드캐스트 (최종 마스터 정제 버전)
     */
    await sendBulkSseNotifications({
      url: API_ROUTES.SSE.ADMIN,
      savedNotifications,
      target: NOTIFICATION_TARGET.ADMIN,
      type: NOTIFICATION_TYPE.RSS_FAILED,
      channelName: "관리자 에러 알림",
      extraMeta: {
        feedId: params.feedId,
        siteId: params.siteId,
        feedExecutionLogId: params.feedExecutionLogId,
      },
    });
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

  /**
   * 관리자 알림 상세 조회
   */
  async getNotificationDetail(
    id: string,
  ): Promise<NotificationWithSiteAndFeedExecutionLogDto> {
    const data = await this.notificationRepository.findDetailById(id);
    if (!data) {
      notFound();
    }
    return toNotificationWithSiteAndFeedExecutionLogDto(data);
  }

  /**
   * 신규 FeedItem 사용자 알림 생성
   *
   * @description
   * Feed를 구독 중인 모든 사용자에게
   * 신규 FeedItem 알림을 생성한다.
   */
  async createFeedItemNotifications(params: {
    feedId: string;
    createdItems: {
      feedItemId: string;
      title: string;
      link: string;
      guid?: string;
    }[];
  }): Promise<void> {
    const { feedId, createdItems } = params;

    /**
     * 1. 신규 FeedItem 없음
     */
    if (!createdItems.length) return;

    /**
     * 2. 구독자 조회
     */
    const subscribers = await this.subscriptionService.getSubscribers(feedId);

    /**
     * 3. 구독자 없음
     */
    if (!subscribers.length) return;

    /**
     * 4. 알림 데이터 생성 (DB 저장용)
     */
    const notifications = subscribers.flatMap((subscriber) =>
      createdItems.map((item) => ({
        userId: toObjectId(subscriber.userId),
        target: NOTIFICATION_TARGET.USER,
        type: NOTIFICATION_TYPE.NEW_FEED_ITEM,
        title: item.title,
        message: "새로운 글이 등록되었습니다.",
        metadata: {
          feedId: toObjectId(feedId),
          feedItemId: toObjectId(item.feedItemId),
          originUrl: item.link,
        },
      })),
    );

    /**
     * 5. DB 저장
     */
    const savedNotifications =
      await this.notificationRepository.createMany(notifications);
    /**
     * 6. SSE 브로드캐스트 (내부 API 브릿지 호출 방식으로 전면 교체)
     */
    console.log(
      `📢 [User Feed SSE] 발송 대상 개수: ${savedNotifications.length}개`,
    );

    /**
     * 6. SSE 브로드캐스트 (최종 마스터 정제 버전)
     */
    await sendBulkSseNotifications({
      url: API_ROUTES.SSE.USER,
      savedNotifications,
      target: NOTIFICATION_TARGET.USER,
      type: NOTIFICATION_TYPE.NEW_FEED_ITEM,
      channelName: "유저 피드 알림",
    });
  }

  // 문의 관리자 알림
  async createAdminInquiryNotification(params: {
    inquiryId: string;
    userId: string;
    title: string;
    message: string;
  }): Promise<void> {
    const admins = await this.userService.findAdmins();
    if (!admins.length) return;

    const notifications = admins.map((admin) => ({
      userId: toObjectId(admin._id),
      target: NOTIFICATION_TARGET.ADMIN,
      type: NOTIFICATION_TYPE.INQUIRY_CREATED,
      title: "새 문의 등록",
      message: [
        `Title: ${params.title}`,
        `Message: ${params.message}`,
        `User ID: ${params.userId}`,
      ].join("\n"),
      metadata: {
        inquiryId: toObjectId(params.inquiryId),
        userId: toObjectId(params.userId),
      },
    }));

    const savedNotifications =
      await this.notificationRepository.createMany(notifications);

    await sendBulkSseNotifications({
      url: API_ROUTES.SSE.ADMIN,
      savedNotifications,
      target: NOTIFICATION_TARGET.ADMIN,
      type: NOTIFICATION_TYPE.INQUIRY_CREATED,
      channelName: "관리자 문의 알림",
      extraMeta: {
        inquiryId: params.inquiryId,
        userId: params.userId,
      },
    });
  }

  // 버그 신고 관리자 알림
  async createAdminReportNotification(params: {
    reportId: string;
    userId: string;
    reason: string;
  }): Promise<void> {
    const admins = await this.userService.findAdmins();
    if (!admins.length) return;

    const title = "새 신고 접수";

    const message = [
      `Report ID: ${params.reportId}`,
      `Reporter ID: ${params.userId}`,
      `Reason: ${params.reason}`,
    ].join("\n");

    const notifications = admins.map((admin) => ({
      userId: toObjectId(admin._id),
      target: NOTIFICATION_TARGET.ADMIN,
      type: NOTIFICATION_TYPE.REPORT_CREATED,
      title,
      message,
      metadata: {
        reportId: params.reportId,
        userId: params.userId,
      },
    }));

    const savedNotifications =
      await this.notificationRepository.createMany(notifications);

    await sendBulkSseNotifications({
      url: API_ROUTES.SSE.ADMIN,
      savedNotifications,
      target: NOTIFICATION_TARGET.ADMIN,
      type: NOTIFICATION_TYPE.REPORT_CREATED,
      channelName: "관리자 신고 알림",
      extraMeta: {
        reportId: params.reportId,
        userId: params.userId,
      },
    });
  }

  async createAdminReplyNotification(params: {
    requestId: string;
    userId: string;
    title: string;
    message: string;
    type: NotificationType;
  }): Promise<void> {
    const notification = await this.notificationRepository.create({
      userId: toObjectId(params.userId),
      target: NOTIFICATION_TARGET.USER,
      type: params.type,
      title: params.title,
      message: params.message,
      metadata: {
        requestId: params.requestId,
        userId: params.userId,
      },
    });

    await sendSseNotification({
      url: API_ROUTES.SSE.USER, // 👈 admin이 아니라 user 채널
      notification,
      target: NOTIFICATION_TARGET.USER,
      type: params.type,
      channelName: "사용자 답변 알림",
    });
  }
}
