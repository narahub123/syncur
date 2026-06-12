import { PaginatedResponse } from "@/shared/types/pagination";
import { NotificationTarget } from "../constants/notification-target";
import { NotificationType } from "../constants/notification-type";
import {
  FeedExecutionErrorType,
  FeedExecutionReason,
  FeedExecutionStage,
  FeedExecutionStatus,
} from "@/features/feed-execution-logs/constants/feed-execution-log";

/**
 * Notification 관련 리소스 정보
 */
export interface NotificationMetadataDto {
  /**
   * 관련 피드 ID
   */
  feedId?: string;

  /**
   * 관련 게시글 ID
   */
  postId?: string;

  /**
   * 관련 사이트 ID
   */
  siteId?: string;

  /**
   * 관련 RSS 실행 로그 ID
   */
  feedExecutionLogId?: string;
}

/**
 * Notification 응답 DTO
 *
 * 클라이언트에 전달되는 최종 데이터 형태
 */
export interface NotificationDto {
  /**
   * 알림 ID
   */
  _id: string;

  /**
   * 알림 수신 사용자 ID
   */
  userId: string;

  /**
   * 알림 수신 대상
   */
  target: NotificationTarget;

  /**
   * 알림 종류
   */
  type: NotificationType;

  /**
   * 알림 제목
   */
  title: string;

  /**
   * 알림 내용
   */
  message: string;

  /**
   * 읽음 여부
   */
  isRead: boolean;

  /**
   * 관련 리소스 정보
   */
  metadata?: NotificationMetadataDto;

  /**
   * 생성일시
   */
  createdAt: string;

  /**
   * 수정일시
   */
  updatedAt: string;
}

export type NotificationDtoPagedResponse = PaginatedResponse<NotificationDto>;

/**
 * 관리자 알림 목록 조회용 DTO
 */
export interface NotificationWithSiteAndFeedExecutionLogDto extends NotificationDto {
  /**
   * 관련 사이트
   */
  site: {
    _id: string;
    name: string;
    url: string;
    faviconUrl: string | null;
  } | null;

  /**
   * 관련 실행 로그
   */
  feedExecutionLog: {
    _id: string;
    executionId: string;

    status: FeedExecutionStatus;
    reason?: FeedExecutionReason | null;

    failedAtStage?: FeedExecutionStage | null;

    error?: {
      type?: FeedExecutionErrorType | null;
      message?: string | null;
    };

    startedAt?: string;
    finishedAt?: string;

    durationMs?: number | null;
  } | null;
}

/**
 * Notification 페이지 응답 DTO
 */

export type NotificationWithSiteAndFeedExecutionLogDtoPagedResponse =
  PaginatedResponse<NotificationWithSiteAndFeedExecutionLogDto>;
