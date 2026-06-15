import { UserLean } from "@/shared/types/domain-leans";
import { Types } from "mongoose";

/**
 * 몽고디비 원본 타입을 그대로 유지하는 Faq Lean 타입
 */
export interface FaqLean {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  category: string;
  question: string;
  answer: string;
  sortOrder: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * FAQ 목록 조회용
 *
 * Faq
 * + User
 */
export interface FaqWithUserLean extends FaqLean {
  /**
   * 관련 작성자 정보 (UserLean 전체 사용)
   */
  user: UserLean | null;
}

export interface FaqWithUserLeanPagedResponse {
  items: FaqWithUserLean[];
  totalCount: number;
}
