import { RequestResponseDTO } from "../dtos";
import { RequestLean } from "../types/lean";

/**
 * Request 원본 Lean 객체를 직렬화된 RequestResponseDTO로 변환합니다.
 */
export const toRequestDto = (lean: RequestLean): RequestResponseDTO => {
  return {
    id: lean._id.toString(),
    userId: lean.userId.toString(),
    userEmail: lean.userEmail,
    type: lean.type,
    title: lean.title,
    content: lean.content,
    status: lean.status,
    //  metadata가 존재하면 배열까지 안전하게 풀어서 전달
    metadata: lean.metadata
      ? {
          ...lean.metadata,
          fileUrls: [...lean.metadata.fileUrls], // 배열 복사
        }
      : undefined,
    // 내부 서브 다큐먼트 Date 객체 직렬화 분기 처리
    adminReply: lean.adminReply
      ? {
          replyContent: lean.adminReply.replyContent,
          repliedBy: lean.adminReply.repliedBy.toString(),
          repliedAt: lean.adminReply.repliedAt.toISOString(),
          repliedUpdatedAt: lean.adminReply.repliedUpdatedAt.toISOString(),
        }
      : null,
    createdAt: lean.createdAt.toISOString(),
    updatedAt: lean.updatedAt.toISOString(),
  };
};
