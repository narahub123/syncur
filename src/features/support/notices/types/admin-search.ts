import { ImageInfo } from "@/shared/lib/cloudinary/image-info.model";
import { UserLean } from "@/shared/types/domain-leans";
import { SortOrder } from "@/shared/types/pagination";

/**
 * 관리자 공지사항 검색 및 정렬 조건 규격
 */
export type AdminNoticeSearchField = "title" | "content";
export type AdminNoticeSort =
  | "title"
  | "category"
  | "views"
  | "isPinned"
  | "createdAt"
  | "createdBy";

export interface AdminNoticeQuery {
  page: number;
  limit: number;
  search: string;
  searchField: AdminNoticeSearchField;
  sort?: AdminNoticeSort;
  sortOrder?: SortOrder;
  isPinned?: boolean; // 고정글만 필터링 기능 추가
}

/**
 * Repository 집계 결과 전용 인터페이스 (작성자 어드민 Join 완료 상태)
 */
export interface NoticeWithUserLean {
  _id: string;
  title: string;
  content: string;
  category: string;
  views: number;
  isPinned: boolean;
  createdBy: string; // 원본 ID
  images: ImageInfo[];
  createdAt: Date;
  updatedAt: Date;
  // 💡 작성자 어드민 정보 전체 결합
  author: UserLean | null;
}

/**
 * Repository 응답 포맷
 */
export interface NoticeAdminLeanPagedResponse {
  items: NoticeWithUserLean[];
  totalCount: number;
}

/**
 * 최종 클라이언트 전달용 어드민 공지사항 응답 DTO
 */
export interface AdminNoticeResponseDTO {
  _id: string;
  title: string;
  content: string;
  category: string;
  views: number;
  isPinned: boolean;
  images: ImageInfo[];
  createdAt: string;
  updatedAt: string;
  author: {
    _id: string;
    email: string;
    name: string | null;
    image: string | null;
  } | null;
}
