import { ImageInfo } from "@/shared/lib/cloudinary/image-info.model";

/**
 * 프론트엔드로 전송하기 위한 공지사항 응답 DTO
 */
export interface NoticeResponseDTO {
  _id: string; // 💡 Types.ObjectId -> string 변환
  title: string;
  content: string;
  category: string;
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
  category: string;
  isPinned?: boolean; // 상단 고정 여부
  images: ImageInfo[];
}

export interface CreateNoticeRequestDto extends CreateNoticeDto {
  deletedImages: ImageInfo[];
}

/**
 * 공지사항 수정용 DTO
 */
export interface UpdateNoticeDto {
  title?: string;
  content?: string;
  category?: string;
  isPinned?: boolean;
  images?: ImageInfo[];
}

export interface UpdateNoticeRequestDto extends UpdateNoticeDto {
  deletedImages: ImageInfo[];
}

export interface AdminNoticeResponseDTO {
  _id: string;
  title: string;
  content: string;
  category: string;
  views: number;
  isPinned: boolean;
  images: ImageInfo[];
  createdAt: string;
  updatedAt: string;
  author: {
    _id: string;
    email: string;
    name: string | null;
    image: string | null;
    profileImage: ImageInfo | null;
  } | null;
}
