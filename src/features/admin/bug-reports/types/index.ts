// shared/types/adminBug.ts
import { FormFieldConfig } from "@/shared/types/form";

// 1. 데이터베이스 또는 API에서 넘어오는 유저의 원본 버그 신고 상세 데이터 타입
export interface AdminBugReportDetail {
  id: string;
  userEmail: string;
  title: string;
  content: string;
  os: string; // 유저 환경: OS (e.g., Windows, macOS, iOS)
  browser: string; // 유저 환경: 브라우저 (e.g., Chrome, Safari)
  fileUrl: string | null; // 유저가 첨부한 스크린샷 등 파일 경로
  createdAt: string;
  currentStatus: "접수대기" | "확인중" | "수정중" | "해결완료";
}

// 2. 관리자가 답변 작성 및 상태 변경 시 사용할 Form Values 타입
export interface BugAnswerFormValues {
  replyContent: string;
  status: "확인중" | "수정중" | "해결완료";
  issueTrackerUrl?: string; // (선택) Jira나 GitHub Issue 링크 연동용
}

// 3. DynamicForm에 주입할 관리자 전용 설정
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
    options: ["확인중", "수정중", "해결완료"],
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
