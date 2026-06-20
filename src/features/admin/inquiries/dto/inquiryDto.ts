import { RequestMetadata } from "@/features/support/requests/types/lean";
import { UserBasicDto } from "@/features/users/dto/userDto";
import { ImageInfo } from "@/shared/lib/cloudinary/image-info.model";
import { InquiryStatus, AnswerStatus } from "../types/search";

/**
 * Inquiry 상세(Admin View)
 */
export interface AdminInquiryDetail {
  _id: string;
  user: UserBasicDto | null;
  title: string;
  content: string;
  createdAt: string;
  metadata?: RequestMetadata;
  currentStatus: InquiryStatus;
}

/**
 * Inquiry Admin Response DTO
 */
export interface AdminInquiryResponseDTO {
  _id: string;

  userEmail: string;

  title: string;
  content: string;

  status: InquiryStatus;

  metadata?: {
    category: string;
    images: ImageInfo[];
  };

  createdAt: string;
  updatedAt: string;

  user: UserBasicDto | null;

  adminReply: {
    replyContent: string;
    repliedAt: string;
    repliedUpdatedAt: string;
    repliedByAdmin: {
      id: string;
      email: string;
      name: string | null;
    } | null;
    images: ImageInfo[];
  } | null;

  /**
   * Inquiry 전용: 답변 상태 (BugReport 구조와 동일한 확장 포인트 유지)
   */
  answerStatus?: AnswerStatus;
}
