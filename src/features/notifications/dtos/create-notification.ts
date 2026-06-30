import { Types } from "mongoose";
import { NotificationTarget } from "../constants/notification-target";
import { NotificationType } from "../constants/notification-type";

/**
 * Notification 생성용 Metadata
 */
export interface CreateNotificationMetadataDto {
  /**
   * 관련 피드 ID
   */
  feedId?: Types.ObjectId;

  /**
   * 관련 게시글 ID
   */
  postId?: Types.ObjectId;

  /**
   * 관련 사이트 ID
   */
  siteId?: Types.ObjectId;

  /**
   * 관련 RSS 실행 로그 ID
   */
  feedExecutionLogId?: string;

  originUrl?: string; // 형식을 안정적으로 받아오기 위해 string 타입 추가

  inquiryId?: string;
  reportId?: string;
  userId?: string;
  requestId?: string;
}

/**
 * Notification 생성 DTO
 */
export interface CreateNotificationDto {
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
   * 관련 리소스 정보
   */
  metadata?: CreateNotificationMetadataDto;
}
