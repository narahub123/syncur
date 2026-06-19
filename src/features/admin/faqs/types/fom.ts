import { FaqCategory, FaqPinStatus } from "./search";

// 1. FAQ 등록/수정 시 사용할 Form Values 타입
export interface FaqFormValues {
  id: string;
  userId: string;
  category: FaqCategory;
  question: string;
  answer: string;
  sortOrder: string; // 폼 입력값은 기본적으로 문자열로 들어오므로 string 처리 (제출 시 숫자로 변환)
  isPublished: FaqPinStatus;
  createdAt: string;
}
