import { Types } from "mongoose";

/**
 * 몽고디비 원본 타입을 그대로 유지하는 Notice Lean 타입
 */
export interface NoticeLean {
  _id: Types.ObjectId;
  title: string;
  content: string;
  isPinned: boolean;
  views: number;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
