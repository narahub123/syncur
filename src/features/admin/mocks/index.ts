import {
  AdminBugReportDetail,
  BugAnswerFormValues,
} from "../bug-reports/types";
import { AnswerFormValues, UserInquiryData } from "../inquiries/types";

export const mockInquiryExample: UserInquiryData = {
  id: "inq_20260615_001",
  userEmail: "customer_success@gmail.com",
  title: "결제 영수증 발급 및 세금계산서 발행 프로세스 문의",
  content: `안녕하세요.\n이번에 엔터프라이즈 플랜으로 결제를 완료했는데, 혹시 사내 지출 결의서 작성을 위한 세금계산서 발행이 가능할까요?\n\n마이페이지 인보이스 내역에는 일반 영수증 출력만 확인되어서 별도로 요청해 드립니다. 처리에 필요한 고유 번호나 사업자등록증 첨부 양식이 있다면 양식 주소도 공유해 주시면 감사하겠습니다.`,
  createdAt: "2026-06-15 09:12",
  currentStatus: "대기중", // '대기중' | '처리중' | '답변완료'
};

export const mockBugReportExample: AdminBugReportDetail = {
  id: "bug_20260615_089",
  userEmail: "frontend_dev_user@naver.com",
  title: "다크모드 전환 시 대시보드 차트 폰트 깨짐 및 무한 로딩 현상",
  content: `대시보드 메인 페이지에서 우측 상단 토글을 이용해 '다크모드'로 전환하면, SVG 차트 내부의 텍스트가 흰색 배경과 겹쳐 가독성이 완전히 상실됩니다.\n\n또한 이 상태에서 새로고침(F5)을 누르면 간헐적으로 차트 컴포넌트 렌더링 스크립트 단에서 순환 참조 오류가 나는지 브라우저가 먹통이 되면서 페이지 무한 로딩이 걸립니다. 확인 부탁드립니다.`,
  os: "macOS Sonoma (14.5)",
  browser: "Google Chrome (Version 125.0.6422.142)",
  fileUrl:
    "https://storage.syncur.com/uploads/bug-reports/2026/06/dashboard-error-screenshot.png", // 첨부파일 주소 (없으면 null)
  createdAt: "2026-06-15 10:24",
  currentStatus: "접수대기", // '접수대기' | '확인중' | '수정중' | '해결완료'
};

export const mockInquiryExistingAnswer: AnswerFormValues = {
  replyContent: `안녕하세요, Woodpecker 지원 팀입니다.\n\n엔터프라이즈 플랜 결제에 감사드립니다. 사내 지출 증빙을 위한 세금계산서 발행은 수동으로 진행해 드리고 있습니다.\n\n사업자등록증 사본과 함께 수신받으실 이메일 주소를 본 채널 혹은 공식 메일(billing@woodpecker.com)로 회신해 주시면 영업일 기준 2일 이내에 국세청 가상 발행 후 안내해 드리겠습니다.\n\n추가적인 문의 사항이 있으시다면 언제든 편하게 말씀해 주세요. 감사합니다.`,
  status: "답변완료",
};

export const mockBugExistingAnswer: BugAnswerFormValues = {
  replyContent: `제보해 주신 내용을 바탕으로 로컬 환경에서 테스트를 진행한 결과, 다크모드 테마 컨텍스트 주입 시점과 차트 라이브러리(Recharts)의 초기화 애니메이션 타이밍이 어긋나 발생하는 무한 루프 현상을 확인했습니다.\n\n현재 공통 레이아웃 컴포넌트 내부의 테마 공급자(ThemeProvider) 렌더링 블록 로직을 수정하고 있으며, 조속히 패치하여 본 답변을 통해 다시 안내해 드리겠습니다.`,
  status: "수정중",
  issueTrackerUrl: "https://github.com/my-team/woodpecker/issues/402", // 내부 깃허브 이슈 번호 연동 상태
};
