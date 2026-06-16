// shared/types/adminBug.ts
import { FormFieldConfig } from "@/shared/types/form";

// 1. 상태 타입 정의
export type BugStatus = "접수대기" | "확인중" | "수정중" | "해결완료";

// 2. 관리자용 상태 옵션 정의 (DynamicForm 및 Select에서 사용)
export const BUG_STATUS_OPTIONS: { label: string; value: BugStatus }[] = [
  { label: "접수대기", value: "접수대기" },
  { label: "확인중", value: "확인중" },
  { label: "수정중", value: "수정중" },
  { label: "해결완료", value: "해결완료" },
];

// 3. 데이터베이스 또는 API에서 넘어오는 유저의 원본 버그 신고 상세 데이터 타입
export interface AdminBugReportDetail {
  id: string;
  userEmail: string;
  title: string;
  content: string;
  os: string;
  browser: string;
  fileUrl: string | null;
  createdAt: string;
  currentStatus: BugStatus; // string 대신 BugStatus 타입 적용
}

// 4. 관리자가 답변 작성 및 상태 변경 시 사용할 Form Values 타입
export interface BugAnswerFormValues {
  replyContent: string;
  status: BugStatus; // string 대신 BugStatus 타입 적용
  issueTrackerUrl?: string;
}

// 5. DynamicForm에 주입할 관리자 전용 설정
export const bugAnswerFormConfig: FormFieldConfig[] = [
  {
    name: "replyContent",
    label: "버그 분석 및 답변 작성",
    type: "textarea",
    placeholder:
      "원인 분석 결과 또는 유저에게 안내할 조치 사항을 입력해 주세요.",
    required: true,
  },
  {
    name: "status",
    label: "진행 상태 변경",
    type: "select",
    placeholder: "버그 처리 상태를 선택하세요.",
    options: BUG_STATUS_OPTIONS, // 고정된 배열 대신 타입 안전한 옵션 사용
    required: true,
  },
  {
    name: "issueTrackerUrl",
    label: "개발 이슈 티켓 링크 (선택)",
    type: "text",
    placeholder:
      "내부 이슈 트래커(GitHub, Jira 등) 주소가 있다면 입력해 주세요.",
    required: false,
  },
];
