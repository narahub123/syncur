import { NoticeResponseDTO } from "../dtos/noticeDto";
import { NoticeLean } from "../types/lean";

/**
 * Notice 원본 Lean 객체를 직렬화된 NoticeResponseDTO로 변환합니다.
 */
export const toNoticeDto = (lean: NoticeLean): NoticeResponseDTO => {
  return {
    _id: lean._id.toString(),
    title: lean.title,
    content: lean.content,
    status: lean.status,
    category: lean.category,
    isPinned: lean.isPinned,
    views: lean.views,
    createdBy: lean.createdBy.toString(),
    images: lean.images,
    createdAt: lean.createdAt.toISOString(),
    updatedAt: lean.updatedAt.toISOString(),
  };
};

export const toNoticeDtos = (items: NoticeLean[]) => {
  return items.map(toNoticeDto);
};
