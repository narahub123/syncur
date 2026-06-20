// ==========================================
// 1. 공지사항(Notice) 타입 및 설정

import { ImageInfo } from "@/shared/lib/cloudinary/image-info.model";
import { NoticeCategory, NoticePinStatus, NoticeStatus } from "./search";

// ==========================================
export interface NoticeFormValues {
  title: string;
  status: NoticeStatus;
  category: NoticeCategory;
  content: string;
  isPinned: NoticePinStatus;
  images: ImageInfo[];
}
