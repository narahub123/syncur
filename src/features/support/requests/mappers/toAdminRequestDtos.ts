import {
  AdminRequestResponseDTO,
  RequestWithUserAndAdminLean,
} from "../types/admin-search";

/**
 * Mongoose 집계(Aggregate) 원시 객체를 어드민 응답용 DTO 구조로 변환합니다.
 * * @description MongoDB ObjectId 및 Date 타입 인스턴스들을 Next.js Server Actions 경계선에서
 * 직렬화 오류(Serialization Error)가 발생하지 않도록 순수 문자열(string) 형태로 캐스팅합니다.
 * * @param lean 유저 정보와 답변자 어드민 정보가 통째로 Double Join 처리된 Lean 객체
 * @returns 직렬화 가능한 클라이언트 전용 데이터 구조인 AdminRequestResponseDTO
 */
export function toAdminRequestDto(
  lean: RequestWithUserAndAdminLean,
): AdminRequestResponseDTO {
  return {
    // 💡 RequestWithUserAndAdminLean 인터페이스 스펙상 _id가 이미 string이므로 toString() 생략 가능
    _id: lean._id.toString(),
    userEmail: lean.userEmail,
    type: lean.type,
    title: lean.title,
    content: lean.content,
    status: lean.status,
    metadata: lean.metadata,
    createdAt: lean.createdAt.toISOString(),
    updatedAt: lean.updatedAt.toISOString(),

    // 💡 UserLean 타입 구조 스펙(Types.ObjectId)에 기반한 안전한 객체 파싱
    user: lean.user
      ? {
          _id: lean.user._id.toString(), // Types.ObjectId 캐스팅
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
          // 💡 서브 도큐먼트 내에 조인된 어드민 역시 동일한 UserLean 타입이므로 동일하게 캐스팅 적용
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
 * 어드민 제보 내역 원시 객체 배열을 DTO 배열로 일괄 변환합니다.
 * * @param leads Double Join 처리가 완료된 Lean 객체 배열
 * @returns 직렬화가 완료된 AdminRequestResponseDTO 배열
 */
export function toAdminRequestDtos(
  leads: RequestWithUserAndAdminLean[],
): AdminRequestResponseDTO[] {
  return leads.map(toAdminRequestDto);
}
