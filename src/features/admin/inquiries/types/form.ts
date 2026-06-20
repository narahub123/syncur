import { ImageInfo } from "@/shared/lib/cloudinary/image-info.model";
import { AnswerStatus } from "./search";

export interface AnswerFormValues {
  replyContent: string;
  status: AnswerStatus;
  images?: ImageInfo[]; // 💡 답변용 이미지 추가
}
