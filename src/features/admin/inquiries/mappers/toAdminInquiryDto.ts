import { RequestWithUserAndAdminLean } from "@/features/support/requests/types/admin-search";

import { AdminInquiryResponseDTO } from "../dto/inquiryDto";
import { INQUIRY_STATUS, InquiryStatus } from "../types/search";
import { RequestStatus } from "@/features/support/requests/constants/request-type";

const statusMap: Partial<Record<RequestStatus, InquiryStatus>> = {
  PENDING: INQUIRY_STATUS.PENDING,
  PROCESSING: INQUIRY_STATUS.PROCESSING,
  COMPLETED: INQUIRY_STATUS.COMPLETED,

  // 기존 시스템 호환용 (필요 시 유지)
  CHECKING: INQUIRY_STATUS.PROCESSING,
  FIXING: INQUIRY_STATUS.PROCESSING,
};

/**
 * Request → Inquiry DTO 변환
 */
export function toAdminInquiryDto(
  lean: RequestWithUserAndAdminLean,
): AdminInquiryResponseDTO {
  return {
    _id: lean._id.toString(),
    userEmail: lean.userEmail,
    title: lean.title,
    content: lean.content,

    status: statusMap[lean.status] ?? INQUIRY_STATUS.PENDING,

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

    // Inquiry 전용 확장 필드 (있을 경우만)
    answerStatus:
      lean.status === "COMPLETED"
        ? INQUIRY_STATUS.COMPLETED
        : INQUIRY_STATUS.PROCESSING,
  };
}

/**
 * list 변환
 */
export function toAdminInquiryDtos(
  leans: RequestWithUserAndAdminLean[],
): AdminInquiryResponseDTO[] {
  return leans.map(toAdminInquiryDto);
}
