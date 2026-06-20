import { RequestWithUserAndAdminLean } from "@/features/support/requests/types/admin-search";

import { AdminBugReportResponseDTO } from "../dto/bugReportDto";
import { BUG_REPORT_STATUS, BugReportStatus } from "../types/search";
import { RequestStatus } from "@/features/support/requests/constants/request-type";

const statusMap: Partial<Record<RequestStatus, BugReportStatus>> = {
  PENDING: BUG_REPORT_STATUS.PENDING,
  CHECKING: BUG_REPORT_STATUS.CHECKING,
  FIXING: BUG_REPORT_STATUS.FIXING,
  COMPLETED: BUG_REPORT_STATUS.COMPLETED,
  PROCESSING: BUG_REPORT_STATUS.CHECKING,
};

/**
 * Request → BugReport DTO 변환 (완전 분리 구조)
 */
export function toAdminBugReportDto(
  lean: RequestWithUserAndAdminLean,
): AdminBugReportResponseDTO {
  return {
    _id: lean._id.toString(),
    userEmail: lean.userEmail,
    title: lean.title,
    content: lean.content,

    status: statusMap[lean.status] ?? BUG_REPORT_STATUS.PENDING,

    metadata: lean.metadata,
    createdAt: lean.createdAt.toISOString(),
    updatedAt: lean.updatedAt.toISOString(),

    user: lean.user
      ? {
          _id: lean.user._id.toString(),
          email: lean.user.email,
          name: lean.user.name,
          image: lean.user.image,
          profileImage: lean.user.profileImage,
          role: lean.user.role,
        }
      : null,

    adminReply: lean.adminReply
      ? {
          replyContent: lean.adminReply.replyContent,
          repliedAt: lean.adminReply.repliedAt.toISOString(),
          repliedUpdatedAt: lean.adminReply.repliedUpdatedAt.toISOString(),
          repliedByAdmin: lean.adminReply.repliedByAdmin
            ? {
                id: lean.adminReply.repliedByAdmin._id.toString(),
                email: lean.adminReply.repliedByAdmin.email,
                name: lean.adminReply.repliedByAdmin.name,
              }
            : null,
          images: lean.adminReply.images,
        }
      : null,
  };
}

/**
 * list 변환
 */
export function toAdminBugReportDtos(
  leads: RequestWithUserAndAdminLean[],
): AdminBugReportResponseDTO[] {
  return leads.map(toAdminBugReportDto);
}
