import { ImageInfo } from "@/shared/lib/cloudinary/image-info.model";

/**
 * 프론트엔드로 전송하기 위한 공지사항 응답 DTO
 */
export interface NoticeResponseDTO {
  id: string; // 💡 Types.ObjectId -> string 변환
  title: string;
  content: string;
  isPinned: boolean;
  views: number;
  createdBy: string;
  images: ImageInfo[];
  createdAt: string; // 💡 Date -> ISO String 변환
  updatedAt: string;
}

/**
 * 공지사항 생성용 DTO
 */
export interface CreateNoticeDto {
  title: string;
  content: string; // 리치 에디터 HTML/Markdown 데이터
  isPinned?: boolean; // 상단 고정 여부
  images: ImageInfo[];
}

/**
 * 공지사항 수정용 DTO
 */
export interface UpdateNoticeDto {
  title?: string;
  content?: string;
  isPinned?: boolean;
  images?: ImageInfo[];
}
