import { RequestMetadata } from "@/features/support/requests/types/lean";
import { UserBasicDto } from "@/features/users/dto/userDto";
import { BugReportStatus } from "../types/search";
import { ImageInfo } from "@/shared/lib/cloudinary/image-info.model";
import { OSType } from "@/features/support/bug-reports/types/bugReport";

export interface AdminBugReportDetail {
  _id: string;
  user: UserBasicDto | null;
  title: string;
  content: string;
  createdAt: string;
  metadata?: RequestMetadata;
  currentStatus: BugReportStatus;
}

/**
 * Bug Report 전용 Admin DTO
 * (Request DTO에서 type=BUG_REPORT만 사용하는 뷰 모델)
 */
export interface AdminBugReportResponseDTO {
  _id: string;
  userEmail: string;

  title: string;
  content: string;

  status: BugReportStatus;

  metadata?: {
    category: string;
    os?: OSType;
    browser?: string;
    images: ImageInfo[];
  };

  createdAt: string;
  updatedAt: string;

  user: UserBasicDto | null;

  adminReply: {
    replyContent: string;
    repliedAt: string;
    repliedUpdatedAt: string;
    repliedByAdmin: {
      id: string;
      email: string;
      name: string | null;
    } | null;
    images: ImageInfo[];
  } | null;
}
