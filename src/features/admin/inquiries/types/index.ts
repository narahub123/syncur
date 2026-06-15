import { FormFieldConfig } from "@/shared/types/form";

export interface UserInquiryData {
  id: string;
  userEmail: string;
  title: string;
  content: string;
  createdAt: string;
  currentStatus: "대기중" | "처리중" | "답변완료";
}

//  문의 답변(Inquiry Reply) 타입 및 설정
export interface AnswerFormValues {
  replyContent: string;
  status: "처리중" | "답변완료";
}

export const answerFormConfig: FormFieldConfig[] = [
  {
    name: "replyContent",
    label: "답변 작성",
    type: "textarea",
    placeholder: "유저에게 전달할 답변 내용을 입력해 주세요.",
    required: true,
  },
  {
    name: "status",
    label: "문의 상태 변경",
    type: "select",
    placeholder: "답변 제출 후 변경할 상태를 선택하세요.",
    options: ["처리중", "답변완료"],
    required: true,
  },
];
