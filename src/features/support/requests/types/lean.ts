import { Types } from "mongoose";
import { RequestStatus, RequestType } from "../constants/request-type";
import { OSType } from "../../bug-reports/types/bugReport";
import { ImageInfo } from "@/shared/lib/cloudinary/image-info.model";

/**
 * 몽고디비 원본 타입을 그대로 유지하는 Request 서브 메타데이터
 */
export interface RequestMetadata {
  category?: string;
  os?: OSType;
  browser?: string;
  images: ImageInfo[];
}

/**
 * 몽고디비 원본 타입을 그대로 유지하는 관리자 답변 서브 도큐먼트
 */
export interface RequestAdminReplyLean {
  replyContent: string;
  repliedAt: Date;
  repliedUpdatedAt: Date;
  repliedBy: Types.ObjectId;
  images: ImageInfo[];
}

/**
 * 몽고디비 원본 타입을 그대로 유지하는 Request Lean 통합 타입
 */
export interface RequestLean {
  _id: Types.ObjectId;
  userId: Types.ObjectId; // 💡 상위 User 스키마를 레퍼런스하는 원본 ObjectId
  userEmail: string;
  type: RequestType;
  title: string;
  content: string;
  status: RequestStatus;
  metadata?: RequestMetadata;
  adminReply?: RequestAdminReplyLean | null;
  createdAt: Date;
  updatedAt: Date;
}
