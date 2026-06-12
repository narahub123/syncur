import { Types } from "mongoose";
import { NotificationTarget } from "../constants/notification-target";
import { NotificationType } from "../constants/notification-type";

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
  postId?: Types.ObjectId;

  /**
   * 관련 사이트 ID
   */
  siteId?: Types.ObjectId;

  /**
   * 관련 RSS 실행 로그 ID
   */
  executionId?: string;
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
