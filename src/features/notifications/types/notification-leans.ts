import { Types } from "mongoose";
import { NotificationTarget } from "../constants/notification-target";
import { NotificationType } from "../constants/notification-type";
import { FeedExecutionLogLean } from "@/features/feed-execution-logs/types/lean";
import { SiteLean } from "@/features/rss/site/types/leans";

/**
 * Notification 관련 리소스 정보
 */
export interface NotificationMetadataLean {
  /**
   * 관련 피드 ID
   */
  feedId?: Types.ObjectId;

  /**
   * 관련 게시글 ID
   */
  feedItemId?: Types.ObjectId;

  /**
   * 관련 사이트 ID
   */
  siteId?: Types.ObjectId;

  /**
   * 관련 RSS 실행 로그 ID
   */
  feedExecutionLogId?: Types.ObjectId;
}

/**
 * Notification Lean
 *
 * MongoDB 조회 결과를 서비스 계층에서
 * 사용하는 순수 데이터 객체
 */
export interface NotificationLean {
  /**
   * 알림 ID
   */
  _id: Types.ObjectId;

  /**
   * 알림 수신 사용자 ID
   */
  userId: Types.ObjectId;

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
  metadata?: NotificationMetadataLean;

  /**
   * 생성일시
   */
  createdAt: Date;

  /**
   * 수정일시
   */
  updatedAt: Date;
}

/**
 * Notification 페이지 응답
 */
export interface NotificationLeanPagedResponse {
  items: NotificationLean[];
  totalCount: number;
}

/**
 * 관리자 알림 목록 조회용
 *
 * Notification
 * + Site
 * + FeedExecutionLog
 */
export interface NotificationWithSiteAndFeedExecutionLogLean extends NotificationLean {
  /**
   * 관련 사이트
   */
  site: Pick<SiteLean, "_id" | "name" | "url" | "favicon_url"> | null;

  /**
   * 관련 실행 로그
   */
  feedExecutionLog: Pick<
    FeedExecutionLogLean,
    | "_id"
    | "executionId"
    | "status"
    | "reason"
    | "error"
    | "failedAtStage"
    | "startedAt"
    | "finishedAt"
    | "durationMs"
  > | null;
}

/**
 * Notification 페이지 응답
 */
export interface NotificationWithSiteAndFeedExecutionLogLeanPagedResponse {
  items: NotificationWithSiteAndFeedExecutionLogLean[];
  totalCount: number;
}
