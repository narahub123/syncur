/**
 * 프론트엔드로 전송하기 위한 FAQ 응답 DTO
 */
export interface FaqResponseDTO {
  id: string; // 💡 Types.ObjectId -> string 변환
  category: string;
  question: string;
  answer: string;
  sortOrder: number;
  createdAt: string; // 💡 Date -> ISO String 변환
  updatedAt: string;
}

/**
 * FAQ 생성용 DTO (Server Action ➔ Service)
 */
export interface CreateFaqDto {
  category: string;
  question: string;
  answer: string;
  sortOrder?: number;
}

/**
 * FAQ 수정용 DTO (전체 필드 선택적 수용)
 */
export interface UpdateFaqDto {
  category?: string;
  question?: string;
  answer?: string;
  sortOrder?: number;
}
