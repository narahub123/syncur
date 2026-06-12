import { NotificationWithSiteAndFeedExecutionLogDto } from "@/features/notifications/dtos/notificationDto";
import { AdminNotificationSort } from "../types";

/**
 * Admin Notification Table Column
 */
export type AdminNotificationTableColumn = {
  key: AdminNotificationSort;
  header: string;
  align?: "left" | "center" | "right";
  render: (
    notification: NotificationWithSiteAndFeedExecutionLogDto,
  ) => React.ReactNode;
};

export const adminNotificationTableColumns: AdminNotificationTableColumn[] = [
  /**
   * Site Name
   */
  {
    key: "siteName" as AdminNotificationSort,
    header: "사이트",
    align: "center",
    render: (n) => n.site?.name ?? "-",
  },

  /**
   * Title
   */
  {
    key: "title",
    header: "제목",
    render: (n) => n.title,
  },

  /**
   * Type
   */
  {
    key: "type",
    header: "타입",
    align: "center",
    render: (n) => n.type,
  },

  /**
   * Message
   */
  {
    key: "message" as AdminNotificationSort,
    header: "내용",
    render: (n) => n.message,
  },

  /**
   * Read Status
   */
  {
    key: "isRead",
    header: "읽음",
    align: "center",
    render: (n) => (n.isRead ? "READ" : "UNREAD"),
  },

  /**
   * Failed Stage (RSS 에러 핵심)
   */
  {
    key: "failedAtStage" as AdminNotificationSort,
    header: "실패 단계",
    align: "center",
    render: (n) => n.feedExecutionLog?.failedAtStage ?? "-",
  },

  /**
   * Error Message
   */
  {
    key: "errorMessage" as AdminNotificationSort,
    header: "에러",
    render: (n) => n.feedExecutionLog?.error?.message ?? "-",
  },

  /**
   * Created At
   */
  {
    key: "createdAt",
    header: "생성일",
    align: "center",
    render: (n) => new Date(n.createdAt).toLocaleString("ko-KR"),
  },
];
