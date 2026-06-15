import { Types } from "mongoose";

/**
 * 몽고디비 원본 타입을 그대로 유지하는 Faq Lean 타입
 */
export interface FaqLean {
  _id: Types.ObjectId;
  category: string;
  question: string;
  answer: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}
