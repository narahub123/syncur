import { Types } from "mongoose";
import { NotificationTarget } from "../constants/notification-target";
import { NotificationType } from "../constants/notification-type";

/**
 * 알림과 연결된 추가 데이터
 *
 * 알림 클릭 시 상세 페이지 이동,
 * 관련 리소스 조회 등에 사용된다.
 */
export interface NotificationMetadata {
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
 * Notification 도메인
 */
export interface Notification {
  /**
   * 알림 ID
   */
  _id: Types.ObjectId;

  /**
   * 수신 사용자 ID
   *
   * ADMIN 알림은 null 가능
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
  metadata?: NotificationMetadata;

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
 * 알림 생성 요청 DTO
 */
export interface CreateNotificationDto {
  /**
   * 수신 사용자 ID
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
  metadata?: NotificationMetadata;
}
