import { RequestStatus, RequestType } from "../constants/request-type";
import { RequestMetadata } from "../types/lean";

/**
 * 관리자 답변 정보 DTO 데이터
 */
export interface RequestAdminReplyDTO {
  replyContent: string;
  repliedAt: string;
  repliedUpdatedAt: string;
  repliedBy: string;
}

/**
 * 1:1 문의 및 버그 제보 통합 응답 DTO
 */
export interface RequestResponseDTO {
  id: string;
  userId: string;
  userEmail: string;
  type: RequestType;
  title: string;
  content: string;
  status: RequestStatus;
  metadata?: RequestMetadata;
  adminReply?: RequestAdminReplyDTO | null;
  createdAt: string;
  updatedAt: string;
}
