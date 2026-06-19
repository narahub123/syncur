import { UserLean } from "@/features/users/types/lean";
import { ImageInfo } from "@/shared/lib/cloudinary/image-info.model";
import { Types } from "mongoose";

/**
 * 몽고디비 원본 타입을 그대로 유지하는 Notice Lean 타입
 */
export interface NoticeLean {
  _id: Types.ObjectId;
  title: string;
  content: string;
  category: string;
  isPinned: boolean;
  views: number;
  createdBy: Types.ObjectId;
  images: ImageInfo[];
  createdAt: Date;
  updatedAt: Date;
}

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
