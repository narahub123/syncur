import mongoose, { Schema, Types, Document } from "mongoose";
import {
  NOTIFICATION_TARGET,
  NotificationTarget,
} from "../constants/notification-target";
import {
  NOTIFICATION_TYPE,
  NotificationType,
} from "../constants/notification-type";
import { NotificationMetadata } from "../types";

/**
 * Notification Document
 */
export interface NotificationDocument extends Document {
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
 * Notification Schema
 */
const NotificationSchema = new Schema<NotificationDocument>(
  {
    /**
     * 알림 수신 사용자
     */
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    /**
     * 알림 수신 대상
     *
     * USER
     * ADMIN
     */
    target: {
      type: String,
      enum: Object.values(NOTIFICATION_TARGET),
      required: true,
    },

    /**
     * 알림 종류
     */
    type: {
      type: String,
      enum: Object.values(NOTIFICATION_TYPE),
      required: true,
    },

    /**
     * 알림 제목
     */
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    /**
     * 알림 내용
     */
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    /**
     * 읽음 여부
     */
    isRead: {
      type: Boolean,
      default: false,
    },

    /**
     * 알림과 연결된 리소스 정보
     *
     * 상세 페이지 이동,
     * 관련 데이터 조회 등에 사용
     */
    metadata: {
      feedId: {
        type: Schema.Types.ObjectId,
        ref: "Feed",
      },

      feedItemId: {
        type: Schema.Types.ObjectId,
        ref: "FeedItem",
      },

      siteId: {
        type: Schema.Types.ObjectId,
        ref: "Site",
      },

      feedExecutionLogId: {
        type: Schema.Types.ObjectId,
        ref: "FeedExecutionLog",
      },

      originUrl: {
        type: String,
      },

      // ✅ inquiry / request / report 계열
      inquiryId: {
        type: Schema.Types.ObjectId,
        ref: "Inquiry",
      },

      reportId: {
        type: Schema.Types.ObjectId,
        ref: "Report",
      },

      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },

      requestId: {
        type: Schema.Types.ObjectId,
        ref: "Request",
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

/**
 * 사용자 알림 목록 조회
 *
 * 예)
 * - 최근 알림 조회
 * - 읽지 않은 알림 조회
 */
NotificationSchema.index({
  userId: 1,
  isRead: 1,
  createdAt: -1,
});

/**
 * 사용자 최근 알림 조회
 */
NotificationSchema.index({
  userId: 1,
  createdAt: -1,
});

export const NotificationModel =
  mongoose.models.Notification ||
  mongoose.model<NotificationDocument>("Notification", NotificationSchema);
