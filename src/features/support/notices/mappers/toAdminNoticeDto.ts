import {
  AdminNoticeResponseDTO,
  NoticeWithUserLean,
} from "../types/admin-search";

/**
 * 관리자 공지사항 원시 객체를 어드민 응답 DTO 규격으로 직렬화합니다.
 */
export function toAdminNoticeDto(
  lean: NoticeWithUserLean,
): AdminNoticeResponseDTO {
  return {
    _id: lean._id.toString(), // NoticeWithUserLean의 _id가 string 스펙이므로 그대로 바인딩
    title: lean.title,
    content: lean.content,
    category: lean.category,
    views: lean.views,
    isPinned: lean.isPinned,
    images: lean.images,

    createdAt: lean.createdAt.toISOString(),
    updatedAt: lean.updatedAt.toISOString(),

    author: lean.author
      ? {
          _id: lean.author._id.toString(), // Types.ObjectId 문자열화
          email: lean.author.email,
          name: lean.author.name, // string | null 매칭 성공
          image: lean.author.image, // string | null 매칭 성공
          profileImage: lean.author.profileImage,
        }
      : null,
  };
}

export function toAdminNoticeDtos(
  leads: NoticeWithUserLean[],
): AdminNoticeResponseDTO[] {
  return leads.map(toAdminNoticeDto);
}
