import { PaginatedResponse } from "@/shared/types/pagination";

/**
 * 프론트엔드로 전송하기 위한 FAQ 응답 DTO
 */
export interface FaqResponseDTO {
  _id: string;
  userId: string;
  category: string;
  question: string;
  answer: string;
  sortOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * FAQ 목록 조회용 DTO
 */
export interface FaqWithUserDto extends FaqResponseDTO {
  /**
   * 관련 작성자
   */
  user: {
    _id: string;
    name: string | null;
    email: string;
    image: string | null;
    role: string;
  } | null;
}

/**
 * FAQ 페이지 응답 DTO
 */
export type FaqWithUserDtoPagedResponse = PaginatedResponse<FaqWithUserDto>;

/**
 * FAQ 생성용 DTO (Server Action ➔ Service)
 */
export interface CreateFaqDto {
  category: string;
  question: string;
  answer: string;
  sortOrder?: number;
  isPublished?: boolean;
}

/**
 * FAQ 수정용 DTO (전체 필드 선택적 수용)
 */
export interface UpdateFaqDto {
  category?: string;
  question?: string;
  answer?: string;
  sortOrder?: number;
  isPublished?: boolean;
}
