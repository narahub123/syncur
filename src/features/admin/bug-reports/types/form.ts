import { ImageInfo } from "@/shared/lib/cloudinary/image-info.model";
import { BugReportStatus } from "./search";

export interface BugAnswerFormValues {
  replyContent: string;
  status: BugReportStatus; // string 대신 BugStatus 타입 적용
  images: ImageInfo[];
}
