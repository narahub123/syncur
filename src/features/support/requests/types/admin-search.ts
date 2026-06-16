import { SortOrder } from "@/shared/types/pagination";
import { RequestStatus, RequestType } from "../constants/request-type";
import { UserLean } from "@/shared/types/domain-leans";

/**
 * 관리자 1:1 문의 검색 및 정렬 조건 규격
 */
export type AdminRequestSearchField = "title" | "content" | "userEmail";
export type AdminRequestSort = "title" | "type" | "status" | "createdAt";

export interface AdminRequestQuery {
  page: number;
  limit: number;
  search?: string;
  searchField?: AdminRequestSearchField;
  sort?: AdminRequestSort;
  sortOrder?: SortOrder;
  type?: RequestType; // 문의/버그 필터링용 추가 가능
  status?: RequestStatus; // 대기/완료 상태 필터링용 추가 가능
}

/**
 * Repository 집계 결과 전용 인터페이스 (Double Join 완료 상태)
 */
export interface RequestWithUserAndAdminLean {
  _id: string;
  userId: string;
  userEmail: string;
  type: RequestType;
  title: string;
  content: string;
  status: RequestStatus;
  metadata?: {
    os?: string;
    browser?: string;
    images: string[];
  };
  createdAt: Date;
  updatedAt: Date;
  // 💡 작성 유저 조인 데이터
  user: UserLean | null;
  // 💡 답변자 어드민 정보가 결합된 조인 데이터
  adminReply: {
    replyContent: string;
    repliedAt: Date;
    repliedUpdatedAt: Date;
    repliedByAdmin: UserLean | null;
  } | null;
}

/**
 * Repository 응답 포맷
 */
export interface RequestAdminLeanPagedResponse {
  items: RequestWithUserAndAdminLean[];
  totalCount: number;
}

/**
 * 최종 클라이언트 전달용 어드민 응답 DTO
 */
export interface AdminRequestResponseDTO {
  id: string;
  userEmail: string;
  type: RequestType;
  title: string;
  content: string;
  status: RequestStatus;
  metadata?: {
    os?: string;
    browser?: string;
    images: string[];
  };
  createdAt: string;
  updatedAt: string;

  // 💡 UserLean의 실제 스펙에 맞춰 name에 null 허용 및 image 프로퍼티 추가
  user: {
    id: string;
    email: string;
    name: string | null; // ➔ string | null 로 보정
    image: string | null; // ➔ 추가된 필드 수용
  } | null;

  adminReply: {
    replyContent: string;
    repliedAt: string;
    repliedUpdatedAt: string;
    // 💡 답변을 남긴 어드민 역시 동일하게 보정
    repliedByAdmin: {
      id: string;
      email: string;
      name: string | null; // ➔ string | null 로 보정
    } | null;
  } | null;
}
