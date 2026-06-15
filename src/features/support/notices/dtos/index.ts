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
  createdAt: string; // 💡 Date -> ISO String 변환
  updatedAt: string;
}
